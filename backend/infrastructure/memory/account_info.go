package memory

import (
	"context"
	"sync"

	"github.com/MISW/Portal/backend/domain"
	"github.com/MISW/Portal/backend/domain/repository"
	"golang.org/x/xerrors"
)

func NewAccountInfoStore() repository.AccountInfoRepository {
	return &accountInfoStore{
		m:     new(sync.Mutex),
		store: make(map[string]domain.AccountInfo, 0),
	}
}

// アカウント情報をメモリ上に(一時的に)格納しておく
type accountInfoStore struct {
	m     *sync.Mutex
	store map[string]domain.AccountInfo
}

func (s *accountInfoStore) Save(ctx context.Context, account *domain.AccountInfo) error {
	s.m.Lock()
	defer s.m.Unlock()

	if err := account.Validate(); err != nil {
		return xerrors.Errorf("error in account information: %w", err)
	}

	s.store[account.Token] = *account
	return nil
}

func (s *accountInfoStore) Delete(ctx context.Context, token string) {
	s.m.Lock()
	defer s.m.Unlock()

	delete(s.store, token)
}

func (s *accountInfoStore) GetByToken(ctx context.Context, token string) (*domain.AccountInfo, error) {
	s.m.Lock()
	defer s.m.Unlock()

	account, ok := s.store[token]
	if !ok {
		return nil, ErrNotFound
	}
	return &account, nil
}
