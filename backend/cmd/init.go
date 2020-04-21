package cmd

import (
	"context"
	"encoding/json"
	"os"

	"github.com/MISW/Portal/backend/config"
	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/interfaces/api/private"
	"github.com/MISW/Portal/backend/interfaces/api/public"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/MISW/Portal/backend/internal/email"
	"github.com/MISW/Portal/backend/internal/jwt"
	"github.com/MISW/Portal/backend/internal/middleware"
	"github.com/MISW/Portal/backend/internal/oidc"
	"github.com/MISW/Portal/backend/usecase"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	echo "github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.uber.org/dig"
	"golang.org/x/xerrors"
	"gopkg.in/yaml.v2"
)

func initDig(cfg *config.Config, addr string) *dig.Container {
	c := dig.New()

	err := c.Provide(func() (oidc.Authenticator, error) {
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
	})

	if err != nil {
		panic(err)
	}

	err = c.Provide(func() email.Sender {
		if os.Getenv("DEBUG_MODE") == "1" {
			return email.NewMock()
		}

		return email.NewSender(
			cfg.Email.SMTPServer,
			cfg.Email.Username,
			cfg.Email.Password,
			cfg.Email.From,
		)
	})

	if err != nil {
		panic(err)
	}

	err = c.Provide(func() (db.Ext, error) {
		conn, err := sqlx.Connect("mysql", cfg.Database)

		if err != nil {
			return nil, xerrors.Errorf("failed to connect to mysql: %w", err)
		}

		return conn, nil
	})
	if err != nil {
		panic(err)
	}

	err = c.Provide(persistence.NewPaymentStatusPersistence)
	if err != nil {
		panic(err)
	}

	err = c.Provide(persistence.NewTokenPersistence)
	if err != nil {
		panic(err)
	}

	err = c.Provide(persistence.NewUserPersistence)
	if err != nil {
		panic(err)
	}

	err = c.Provide(persistence.NewPaymentTransactionPersistence)
	if err != nil {
		panic(err)
	}

	err = c.Provide(persistence.NewAppConfigPersistence)
	if err != nil {
		panic(err)
	}

	err = c.Provide(func(
		userRepository repository.UserRepository,
		tokenRepository repository.TokenRepository,
		authenticator oidc.Authenticator,
		mailer email.Sender,
		mailTemplates *config.EmailTemplates,
		jwtProvider jwt.JWTProvider,
	) usecase.SessionUsecase {
		return usecase.NewSessionUsecase(
			userRepository,
			tokenRepository,
			authenticator,
			mailer,
			mailTemplates,
			jwtProvider,
			cfg.BaseURL,
		)
	})
	if err != nil {
		panic(err)
	}
	err = c.Provide(usecase.NewProfileUsecase)
	if err != nil {
		panic(err)
	}
	err = c.Provide(usecase.NewManagementUsecase)
	if err != nil {
		panic(err)
	}

	err = c.Provide(private.NewSessionHandler)
	if err != nil {
		panic(err)
	}
	err = c.Provide(private.NewProfileHandler)
	if err != nil {
		panic(err)
	}
	err = c.Provide(private.NewManagementHandler)
	if err != nil {
		panic(err)
	}

	err = c.Provide(public.NewSessionHandler)
	if err != nil {
		panic(err)
	}

	err = c.Provide(middleware.NewAuthMiddleware)
	if err != nil {
		panic(err)
	}

	err = c.Provide(func() (jwt.JWTProvider, error) {
		return jwt.NewJWTProvider(cfg.JWTKey)
	})
	if err != nil {
		panic(err)
	}

	err = c.Provide(func() *config.EmailTemplates {
		return &cfg.Email.Templates
	})
	if err != nil {
		panic(err)
	}

	return c
}

func initHandler(cfg *config.Config, addr string) *echo.Echo {
	e := echo.New()

	c, _ := yaml.Marshal(e.Routes())
	e.Logger.Infof("addr: %s,\nconfig: %s", addr, c)

	digc := initDig(cfg, addr)

	err := digc.Invoke(func(auth middleware.AuthMiddleware, sh private.SessionHandler) error {
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

			g.GET("/list_users", mh.ListUsers)
			g.POST("/authorize_transaction", mh.AuthorizeTransaction)
			g.GET("/list_users", mh.ListUsers)

			g.GET("/payment_status", mh.GetPaymentStatus)
			g.DELETE("/payment_status", mh.DeletePaymentStatus)
			g.PUT("/payment_status", mh.AddPaymentStatus)
			g.GET("/payment_statuses", mh.GetPaymentStatuses)
		}); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		panic(err)
	}

	err = digc.Invoke(func(sh public.SessionHandler) {
		g := e.Group("/api/public")

		g.POST("/login", sh.Login)
		g.POST("/callback", sh.Callback)
		g.POST("/signup", sh.Signup)
		g.POST("/verify_email", sh.VerifyEmail)
	})

	if err != nil {
		panic(err)
	}

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
