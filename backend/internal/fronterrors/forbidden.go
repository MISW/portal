package fronterrors

// NewForbidden - Forbiddenを生成して返す
func NewForbidden(message string) error {
	return &Forbidden{
		message: message,
	}
}

// Forbidden - ユーザが認証されていない時に返す
type Forbidden struct {
	message string
}

var _ error = &Forbidden{}

func (e Forbidden) Error() string {
	return e.message
}
