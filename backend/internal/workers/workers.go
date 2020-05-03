package workers

import "context"

type Worker interface {
	Start(ctx context.Context)

	Trigger()
}
