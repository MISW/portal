package cmd

import (
	"context"
	"time"

	"github.com/MISW/Portal/backend/config"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/interfaces/api/private"
	"github.com/MISW/Portal/backend/interfaces/api/public"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/MISW/Portal/backend/internal/middleware"
	"github.com/MISW/Portal/backend/internal/oidc"
	"github.com/MISW/Portal/backend/usecase"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"go.uber.org/dig"
	"golang.org/x/xerrors"
)

func initDig(cfg *config.Config, addr string) *dig.Container {
	c := dig.New()

	err := c.Provide(func() (oidc.Authenticator, error) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

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

	c.Provide(persistence.NewPaymentStatusPersistence)
	c.Provide(persistence.NewTokenPersistence)
	c.Provide(persistence.NewUserPersistence)

	c.Provide(usecase.NewSessionUsecase)

	c.Provide(private.NewSessionHandler)
	c.Provide(public.NewSessionHandler)

	c.Provide(middleware.NewAuthMiddleware)

	return c
}

func initHandler(cfg *config.Config, addr string) *echo.Echo {
	e := echo.New()

	digc := initDig(cfg, addr)

	digc.Invoke(func(auth middleware.AuthMiddleware, sh private.SessionHandler) {
		g := e.Group("/api/private/", auth.Authenticate)

		g.POST("/logout", sh.Logout)
	})

	digc.Invoke(func(sh public.SessionHandler) {
		g := e.Group("/api/public/")

		g.POST("/login", sh.Login)
		g.GET("/callback", sh.Callback)
	})

	return e
}
