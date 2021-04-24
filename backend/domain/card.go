package domain

import "golang.org/x/xerrors"

// Card - 会員証の表示のための情報
type Card struct {
	ID                int      `json:"id" yaml:"id"`
	Generation        int      `json:"generation" yaml:"generation"`
	Handle            string   `json:"handle" yaml:"handle"`
	Avatar            *Avatar  `json:"avatar,omitempty" yaml:"avatar,omitempty"`
	Workshops         []string `json:"workshops" yaml:"workshops"`
	Squads            []string `json:"squads" yaml:"squads"`
	DiscordID         string   `json:"discord_id,omitempty" yaml:"discord_id,omitempty"`
	TwitterScreenName string   `json:"twitter_screen_name,omitempty" yaml:"twitter_screen_name,omitempty"`
}

func GetCardFromUser(u *User) (*Card, error) {
	if !u.CardPublished {
		return nil, ErrCardIsNotPublished
	}
	card := &Card{
		ID:                u.ID,
		Generation:        u.Generation,
		Handle:            u.Handle,
		Avatar:            u.Avatar,
		Workshops:         u.Workshops,
		Squads:            u.Squads,
		DiscordID:         u.DiscordID,
		TwitterScreenName: u.TwitterScreenName,
	}
	return card, nil
}

var (
	// ErrCardIsNotPublished - サークル員が会員証を公開していない
	ErrCardIsNotPublished = xerrors.New("card is not published")
)
