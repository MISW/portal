package cmd

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/MISW/Portal/backend/config"
	"github.com/MISW/Portal/backend/infrastructure/persistence"
	"github.com/MISW/Portal/backend/interfaces/api/private"
	"github.com/MISW/Portal/backend/interfaces/api/public"
	"github.com/MISW/Portal/backend/internal/db"
	"github.com/MISW/Portal/backend/internal/middleware"
	"github.com/MISW/Portal/backend/internal/oidc"
	files "github.com/MISW/Portal/backend/test_files"
	"github.com/MISW/Portal/backend/usecase"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
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

	err = c.Provide(func() (db.Ext, error) {
		fmt.Println(cfg.Database)
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
	err = c.Provide(usecase.NewSessionUsecase)
	if err != nil {
		panic(err)
	}

	err = c.Provide(private.NewSessionHandler)
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

	return c
}

func initHandler(cfg *config.Config, addr string) *echo.Echo {
	e := echo.New()

	c, _ := yaml.Marshal(e.Routes())
	e.Logger.Infof("addr: %s,\nconfig: %s", addr, c)

	digc := initDig(cfg, addr)

	err := digc.Invoke(func(auth middleware.AuthMiddleware, sh private.SessionHandler) {
		g := e.Group("/api/private", auth.Authenticate)

		g.POST("/logout", sh.Logout)
	})

	if err != nil {
		panic(err)
	}

	err = digc.Invoke(func(sh public.SessionHandler) {
		g := e.Group("/api/public")

		g.POST("/login", sh.Login)
		g.GET("/callback", sh.Callback)
		g.POST("/signup", sh.Signup)
	})

	if err != nil {
		panic(err)
	}

	e.GET("/", echo.HandlerFunc(func(e echo.Context) error {
		return e.HTML(http.StatusOK, files.Login)
	}))

	e.Logger.SetLevel(log.DEBUG)

	e.Logger.Infof("dig container: %s", digc.String())

	routes, _ := json.MarshalIndent(e.Routes(), "", "  ")
	e.Logger.Infof("all routes in echo: %s", string(routes))

	return e
}
