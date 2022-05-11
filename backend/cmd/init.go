package cmd

import (
	"context"
	"encoding/json"
	"os"

	"github.com/MISW/Portal/backend/config"
	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/interfaces/api/external"
	"github.com/MISW/Portal/backend/interfaces/api/private"
	"github.com/MISW/Portal/backend/interfaces/api/public"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/MISW/Portal/backend/internal/email"
	"github.com/MISW/Portal/backend/internal/jwt"
	"github.com/MISW/Portal/backend/internal/middleware"
	"github.com/MISW/Portal/backend/internal/oidc"
	"github.com/MISW/Portal/backend/internal/slack"
	"github.com/MISW/Portal/backend/internal/workers"
	"github.com/MISW/Portal/backend/usecase"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	echo "github.com/labstack/echo/v4"
	echomiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	"go.uber.org/dig"
	"golang.org/x/xerrors"
	"gopkg.in/yaml.v3"
)

func must(err error) {
	if err != nil {
		panic(err)
	}
}

func initDig(cfg *config.Config, addr string) *dig.Container {
	c := dig.New()

	must(c.Provide(func() (oidc.Authenticator, error) {
		ctx := context.Background()

		oidcCfg := cfg.OpenIDConnect

		auth, err := oidc.NewAuthenticator(
			ctx,
			oidcCfg.ClientID,
			oidcCfg.ClientSecret,
			oidcCfg.RedirectURL,
			oidcCfg.ProviderURL,
			[]string{"openid", "profile", "email"},
		)

		if err != nil {
			return nil, xerrors.Errorf("failed to initialize authenticator for OpenID Connect: %w", err)
		}

		return auth, nil
	}))

	must(c.Provide(func() *slack.Client {
		return slack.NewClient(cfg.SlackToken, cfg.SlackTeamID)
	}))

	must(c.Provide(func() email.Sender {
		if os.Getenv("DEBUG_MODE") == "1" {
			return email.NewMock()
		}

		return email.NewSender(
			cfg.Email.SMTPServer,
			cfg.Email.Username,
			cfg.Email.Password,
			cfg.Email.From,
		)
	}))

	must(c.Provide(func() (db.Ext, error) {
		conn, err := sqlx.Connect("mysql", cfg.Database)

		if err != nil {
			return nil, xerrors.Errorf("failed to connect to mysql: %w", err)
		}

		return conn, nil
	}))

	must(c.Provide(persistence.NewPaymentStatusPersistence))

	must(c.Provide(persistence.NewTokenPersistence))

	must(c.Provide(persistence.NewUserPersistence))

	must(c.Provide(persistence.NewSlackPersistence))

	must(c.Provide(persistence.NewPaymentTransactionPersistence))

	must(c.Provide(persistence.NewAppConfigPersistence))

	must(c.Provide(persistence.NewUserRolePersistence))

	must(c.Provide(persistence.NewExternalIntegrationPersistence))

	must(c.Provide(usecase.NewAppConfigUsecase))

	must(c.Provide(func(
		userRepository repository.UserRepository,
		tokenRepository repository.TokenRepository,
		appConfigRepository repository.AppConfigRepository,
		authenticator oidc.Authenticator,
		mailer email.Sender,
		jwtProvider jwt.JWTProvider,
	) usecase.SessionUsecase {
		return usecase.NewSessionUsecase(
			userRepository,
			tokenRepository,
			authenticator,
			appConfigRepository,
			mailer,
			jwtProvider,
			cfg.BaseURL,
		)
	}))

	must(c.Provide(usecase.NewProfileUsecase))

	must(c.Provide(usecase.NewCardUsecase))

	must(c.Provide(usecase.NewManagementUsecase))

	must(c.Provide(usecase.NewWebhookUsecase))

	must(c.Provide(usecase.NewExternalIntegrationUsecase))

	must(c.Provide(private.NewSessionHandler))

	must(c.Provide(private.NewProfileHandler))

	must(c.Provide(private.NewManagementHandler))

	must(c.Provide(external.NewExternalHandler))

	must(c.Provide(public.NewSessionHandler))

	must(c.Provide(public.NewCardHandler))

	must(c.Provide(func(wu usecase.WebhookUsecase) public.WebhookHandler {
		return public.NewWebhookHandler(cfg.SlackSigningSecret, wu)
	}))

	must(c.Provide(middleware.NewAuthMiddleware))

	must(c.Provide(func() (jwt.JWTProvider, error) {
		return jwt.NewJWTProvider(cfg.JWTKey)
	}))

	must(c.Provide(workers.NewSlackInviter, dig.Name("slack")))

	return c
}

func initDigContainer(cfg *config.Config, addr string) *dig.Container {
	return initDig(cfg, addr)
}

func initWorkers(digc *dig.Container) func() {
	ctx, cancel := context.WithCancel(context.Background())

	if err := digc.Invoke(func(param struct {
		dig.In
		SlackInviter workers.Worker `name:"slack"`
	}) {
		go param.SlackInviter.Start(ctx)
	}); err != nil {
		panic(err)
	}

	return cancel
}

func initHandler(cfg *config.Config, addr string, digc *dig.Container) *echo.Echo {
	e := echo.New()
	e.Use(echomiddleware.Logger())
	e.Use(echomiddleware.Recover())

	c, _ := yaml.Marshal(e.Routes())
	e.Logger.Infof("addr: %s,\nconfig: %s", addr, c)

	must(digc.Invoke(func(auth middleware.AuthMiddleware, sh private.SessionHandler) error {
		g := e.Group("/api/private", auth.Authenticate)

		g.POST("/logout", sh.Logout)

		if err := digc.Invoke(func(ph private.ProfileHandler) {
			prof := g.Group("/profile")

			prof.GET("", ph.Get)
			prof.POST("", ph.Update)
			prof.GET("/payment_statuses", ph.GetPaymentStatuses)
			prof.POST("/payment_transaction", ph.GetPaymentTransaction)
		}); err != nil {
			return err
		}

		if err := digc.Invoke(func(mh private.ManagementHandler) {
			g := g.Group("/management")
			g.Use(middleware.NewRoleValidationMiddleware(domain.Admin).Authenticate)

			g.GET("/users", mh.ListUsers)

			g.GET("/user", mh.GetUser)
			g.POST("/user", mh.UpdateUser)
			g.PATCH("/user", mh.UpdateRole)

			g.POST("/authorize_transaction", mh.AuthorizeTransaction)

			g.GET("/payment_status", mh.GetPaymentStatus)
			g.DELETE("/payment_status", mh.DeletePaymentStatus)
			g.PUT("/payment_status", mh.AddPaymentStatus)
			g.GET("/payment_statuses", mh.GetPaymentStatuses)

			g.POST("/remind_payment", mh.RemindPayment)

			g.GET("/config", mh.GetConfig)
			g.POST("/config", mh.SetConfig)

			slack := g.Group("/slack")

			slack.POST("/invite", mh.InviteToSlack)

		}); err != nil {
			return err
		}

		return nil
	}))

	must(digc.Invoke(func(sh public.SessionHandler) error {
		g := e.Group("/api/public")

		g.POST("/login", sh.Login)
		g.POST("/callback", sh.Callback)
		g.POST("/signup", sh.Signup)
		g.POST("/verify_email", sh.VerifyEmail)

		if err := digc.Invoke(func(wu public.WebhookHandler) {
			g := g.Group("/webhook")

			g.POST("/slack", wu.Slack)
		}); err != nil {
			return err
		}

		if err := digc.Invoke(func(ch public.CardHandler) {
			g.GET("/card/:id", func(c echo.Context) error {
				id := c.Param("id")
				return ch.Get(c, id)
			})
		}); err != nil {
			return err
		}

		return nil
	}))

	must(digc.Invoke(func(eh *external.ExternalHandler) error {
		g := e.Group("/api/external")
		g.Use(middleware.NewStaticTokenAuthMiddleware(cfg.ExternalIntegrationTokens))

		g.GET("/find_role", eh.GetUserRoleFromSlackID)

		g.GET("/all_member_roles", eh.GetAllMemberRolesBySlackID)

		return nil
	}))

	if os.Getenv("DEBUG_MODE") != "" {
		e.Logger.SetLevel(log.DEBUG)
		e.Debug = true
	} else {
		e.Logger.SetLevel(log.INFO)
	}

	e.Logger.Infof("dig container: %s", digc.String())

	routes, _ := json.MarshalIndent(e.Routes(), "", "  ")
	e.Logger.Infof("all routes in echo: %s", string(routes))

	return e
}
