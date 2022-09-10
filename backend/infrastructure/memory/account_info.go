package memory

import (
	"context"
	"sync"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"golang.org/x/xerrors"
)

func NewOIDCAccountInfoStore() repository.OIDCAccountInfoRepository {
	return &oidcAccountInfoStore{
		m:     new(sync.Mutex),
		store: make(map[string]domain.OIDCAccountInfo, 0),
	}
}

// アカウント情報をメモリ上に(一時的に)格納しておく
type oidcAccountInfoStore struct {
	m     *sync.Mutex
	store map[string]domain.OIDCAccountInfo
}

func (s *oidcAccountInfoStore) Save(ctx context.Context, account *domain.OIDCAccountInfo) error {
	s.m.Lock()
	defer s.m.Unlock()

	if err := account.Validate(); err != nil {
		return xerrors.Errorf("error in account information: %w", err)
	}

	s.store[account.Token] = *account
	return nil
}

func (s *oidcAccountInfoStore) Delete(ctx context.Context, token string) {
	s.m.Lock()
	defer s.m.Unlock()

	delete(s.store, token)
}

func (s *oidcAccountInfoStore) GetByToken(ctx context.Context, token string) (*domain.OIDCAccountInfo, error) {
	s.m.Lock()
	defer s.m.Unlock()

	account, ok := s.store[token]
	if !ok {
		return nil, ErrNotFound
	}
	return &account, nil
}
