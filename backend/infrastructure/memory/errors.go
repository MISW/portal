package memory

import "golang.org/x/xerrors"

var (
	ErrNotFound error = xerrors.New("not found")
)
