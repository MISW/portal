package cmd

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"os"

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
	echomw "github.com/labstack/echo/v4/middleware"
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
	err = c.Provide(usecase.NewProfileUsecase)
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

func initReverseProxy(e *echo.Echo) {
	addr, ok := os.LookupEnv("NEXT_SERVER")

	if !ok {
		addr = "http://localhost:3000"
	}

	url, err := url.Parse(addr)
	if err != nil {
		e.Logger.Fatal(err)
	}
	targets := []*echomw.ProxyTarget{
		{
			URL: url,
		},
	}

	e.Group("/*", echomw.Proxy(echomw.NewRoundRobinBalancer(targets)))
}

func initHandler(cfg *config.Config, addr string) *echo.Echo {
	e := echo.New()

	c, _ := yaml.Marshal(e.Routes())
	e.Logger.Infof("addr: %s,\nconfig: %s", addr, c)

	digc := initDig(cfg, addr)

	err := digc.Invoke(func(auth middleware.AuthMiddleware, sh private.SessionHandler) {
		g := e.Group("/api/private", auth.Authenticate)

		g.POST("/logout", sh.Logout)

		digc.Invoke(func(ph private.ProfileHandler) {
			prof := g.Group("/profile")

			prof.GET("", ph.Get)
			prof.POST("", ph.Update)
			prof.GET("/payment_statuses", ph.GetPaymentStatuses)
		})
	})

	if err != nil {
		panic(err)
	}

	err = digc.Invoke(func(sh public.SessionHandler) {
		g := e.Group("/api/public")

		g.POST("/login", sh.Login)
		g.POST("/callback", sh.Callback)
		g.POST("/signup", sh.Signup)
	})

	if err != nil {
		panic(err)
	}

	// e.GET("/", echo.HandlerFunc(func(e echo.Context) error {
	// 	return e.HTML(http.StatusOK, files.Login)
	// }))
	// e.GET("/callback", echo.HandlerFunc(func(e echo.Context) error {
	// 	return e.HTML(http.StatusOK, files.Callback)
	// }))
	initReverseProxy(e)

	e.Logger.SetLevel(log.DEBUG)

	e.Logger.Infof("dig container: %s", digc.String())

	routes, _ := json.MarshalIndent(e.Routes(), "", "  ")
	e.Logger.Infof("all routes in echo: %s", string(routes))

	return e
}
