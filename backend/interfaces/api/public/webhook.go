package public

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/MISW/Portal/backend/internal/rest"

	"github.com/MISW/Portal/backend/usecase"
	"github.com/labstack/echo/v4"
	"github.com/slack-go/slack"
	"github.com/slack-go/slack/slackevents"
	"golang.org/x/xerrors"
)

// WebhookHandler - セッション周りの非公開API
type WebhookHandler interface {
	Slack(e echo.Context) error
}

// NewWebhookHandler - WebhookHandlerを初期化
func NewWebhookHandler(slackSigningSecret string, wu usecase.WebhookUsecase) WebhookHandler {
	return &webhookHandler{
		wu:                 wu,
		slackSigningSecret: slackSigningSecret,
	}
}

var _ WebhookHandler = &webhookHandler{}

type webhookHandler struct {
	wu                 usecase.WebhookUsecase
	slackSigningSecret string
}

func (wh *webhookHandler) Slack(e echo.Context) error {
	verifier, err := slack.NewSecretsVerifier(e.Request().Header, wh.slackSigningSecret)

	if err != nil {
		return xerrors.Errorf("failed to initialize secret verifier: %w", err)
	}

	bodyReader := io.TeeReader(e.Request().Body, &verifier)

	body, err := ioutil.ReadAll(bodyReader)

	if err != nil {
		return xerrors.Errorf("failed to read body: %w", err)
	}

	if err := verifier.Ensure(); err != nil {
		return rest.RespondMessage(
			e,
			rest.NewBadRequest("invalid body or token: "+err.Error()),
		)

	}

	event, err := slackevents.ParseEvent(body, slackevents.OptionNoVerifyToken())

	if err != nil {
		return rest.RespondMessage(
			e,
			rest.NewBadRequest("failed to parse event: "+err.Error()),
		)
	}

	switch event.Type {
	case slackevents.URLVerification:
		var res *slackevents.ChallengeResponse

		if err := json.Unmarshal(body, &res); err != nil {
			return xerrors.Errorf("failed to unmarshal body: %w", err)
		}
		e.Response().Header().Set("Content-Type", "text/plain")

		return e.String(http.StatusOK, res.Challenge)

	case slackevents.CallbackEvent:
		innerEvent := event.InnerEvent
		switch ev := innerEvent.Data.(type) {

		case *slackevents.TeamJoinEvent:
			if ev.Type != slackevents.TeamJoin {
				return xerrors.Errorf("inappropriate type for data: %s", innerEvent.Data)
			}

			err = wh.wu.NewUser(
				e.Request().Context(),
				ev.User.Profile.Email,
				ev.User.ID,
			)
			if err != nil {
				return xerrors.Errorf("failed to unmarshal body: %w", err)
			}

		default:
			return xerrors.Errorf("Unknown callback event, Data: %s", innerEvent.Data)
		}
	}

	return rest.RespondOKAny(e, nil)
}
