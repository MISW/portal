package db

import "github.com/jmoiron/sqlx"

// Ext - transactionかどうかに依らないSQLインターフェース
type Ext interface {
	sqlx.Ext
	sqlx.ExtContext
}
