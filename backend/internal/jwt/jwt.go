package jwt

import (
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/xerrors"
)

// JWTProvider - JWTを作ったり検証したりする奴
type JWTProvider interface {
	GenerateWithMap(claims map[string]interface{}) (string, error)

	Generate(sc *jwt.StandardClaims) (string, error)

	Parse(tokenString string) (*jwt.Token, error)

	ParseAsMap(tokenString string) (map[string]interface{}, error)

	ParseAsStandard(tokenString string) (*jwt.StandardClaims, error)

	ParseAs(tokenString string, as jwt.Claims) (jwt.Claims, error)
}

// NewJWTProvider - initialize jwt provider
func NewJWTProvider(key string) (JWTProvider, error) {
	return &jwtProvider{
		key: []byte(key),
	}, nil
}

type jwtProvider struct {
	key []byte
}

var _ JWTProvider = &jwtProvider{}

func (p *jwtProvider) GenerateWithMap(claims map[string]interface{}) (string, error) {
	token, err := jwt.
		NewWithClaims(jwt.SigningMethodHS512, jwt.MapClaims(claims)).
		SignedString(p.key)

	if err != nil {
		return "", xerrors.Errorf("failed to generate jwt: %w", err)
	}

	return token, nil
}

func (p *jwtProvider) Generate(sc *jwt.StandardClaims) (string, error) {
	token, err := jwt.
		NewWithClaims(jwt.SigningMethodHS512, sc).
		SignedString(p.key)

	if err != nil {
		return "", xerrors.Errorf("failed to generate jwt: %w", err)
	}

	return token, nil
}

func (p *jwtProvider) Parse(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, xerrors.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return p.key, nil
	})

	if err != nil {
		return nil, xerrors.Errorf("failed to parse token: %w", err)
	}

	return token, nil
}

func (p *jwtProvider) ParseAsMap(tokenString string) (map[string]interface{}, error) {
	token, err := p.Parse(tokenString)

	if err != nil {
		return nil, xerrors.Errorf("failed to parse token: %w", err)
	}

	mapClaims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return nil, xerrors.Errorf("the claims are not expected claims(MapClaims)")
	}

	return mapClaims, nil
}

func (p *jwtProvider) ParseAsStandard(tokenString string) (*jwt.StandardClaims, error) {
	token, err := p.Parse(tokenString)

	if err != nil {
		return nil, xerrors.Errorf("failed to parse token: %w", err)
	}

	standardClaims, ok := token.Claims.(*jwt.StandardClaims)

	if !ok {
		return nil, xerrors.Errorf("the claims are not expected claims(StandardClaims)")
	}

	return standardClaims, nil
}

func (p *jwtProvider) ParseAs(tokenString string, as jwt.Claims) (jwt.Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, as, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, xerrors.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return p.key, nil
	})

	if err != nil {
		return nil, xerrors.Errorf("failed to parse token: %w", err)
	}

	return token.Claims, nil
}
