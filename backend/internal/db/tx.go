package db

import (
	"context"
	"database/sql"

	"github.com/jmoiron/sqlx"
	"golang.org/x/xerrors"
)

type txBeginnable interface {
	BeginTxx(ctx context.Context, opts *sql.TxOptions) (*sqlx.Tx, error)
}

// RunInTransaction - トランザクションで実行
func RunInTransaction(ctx context.Context, db Ext, fn func(ctx context.Context, db Ext) error) (err error) {
	s, ok := db.(txBeginnable)

	if !ok {
		return xerrors.Errorf("db is not sqlx db")
	}

	tx, err := s.BeginTxx(ctx, nil)

	if err != nil {
		return xerrors.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if e := recover(); e != nil {
			err = xerrors.Errorf("goroutine paniced: %w", e)
		}

		if err != nil {
			if e := tx.Rollback(); e != nil {
				err = xerrors.Errorf("rollback failed: %w", err)
			}
		}

	}()

	err = fn(ctx, tx)

	if err != nil {
		return xerrors.Errorf("function in transaction failed: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return xerrors.Errorf("failed to commit transaction: %w", err)
	}

	return
}
