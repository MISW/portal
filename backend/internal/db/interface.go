package db

import "github.com/jmoiron/sqlx"

// Ext - transactionかどうかに依らないSQLインターフェース
type Ext interface {
	sqlx.Ext

	sqlx.QueryerContext
	sqlx.ExecerContext

	// Will be replaced accordinglly in Go 1.14
	// sqlx.ExtContext
}
