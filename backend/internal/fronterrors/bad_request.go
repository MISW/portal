package fronterrors

// NewBadRequest - BadRequestを生成して返す
func NewBadRequest(message string) error {
	return &BadRequest{
		message: message,
	}
}

// BadRequest - ユーザの入力値が不正だった場合に返す
type BadRequest struct {
	message string
}

var _ error = &BadRequest{}

func (e BadRequest) Error() string {
	return e.message
}
