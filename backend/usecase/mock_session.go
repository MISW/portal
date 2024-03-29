// Code generated by MockGen. DO NOT EDIT.
// Source: usecase/session.go

// Package usecase is a generated GoMock package.
package usecase

import (
	context "context"
	reflect "reflect"

	domain "github.com/MISW/Portal/backend/domain"
	gomock "github.com/golang/mock/gomock"
)

// MockSessionUsecase is a mock of SessionUsecase interface.
type MockSessionUsecase struct {
	ctrl     *gomock.Controller
	recorder *MockSessionUsecaseMockRecorder
}

// MockSessionUsecaseMockRecorder is the mock recorder for MockSessionUsecase.
type MockSessionUsecaseMockRecorder struct {
	mock *MockSessionUsecase
}

// NewMockSessionUsecase creates a new mock instance.
func NewMockSessionUsecase(ctrl *gomock.Controller) *MockSessionUsecase {
	mock := &MockSessionUsecase{ctrl: ctrl}
	mock.recorder = &MockSessionUsecaseMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockSessionUsecase) EXPECT() *MockSessionUsecaseMockRecorder {
	return m.recorder
}

// Callback mocks base method.
func (m *MockSessionUsecase) Callback(ctx context.Context, expectedState, actualState, code string) (string, bool, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Callback", ctx, expectedState, actualState, code)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(bool)
	ret2, _ := ret[2].(error)
	return ret0, ret1, ret2
}

// Callback indicates an expected call of Callback.
func (mr *MockSessionUsecaseMockRecorder) Callback(ctx, expectedState, actualState, code interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Callback", reflect.TypeOf((*MockSessionUsecase)(nil).Callback), ctx, expectedState, actualState, code)
}

// Login mocks base method.
func (m *MockSessionUsecase) Login(ctx context.Context) (string, string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Login", ctx)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(string)
	ret2, _ := ret[2].(error)
	return ret0, ret1, ret2
}

// Login indicates an expected call of Login.
func (mr *MockSessionUsecaseMockRecorder) Login(ctx interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Login", reflect.TypeOf((*MockSessionUsecase)(nil).Login), ctx)
}

// Logout mocks base method.
func (m *MockSessionUsecase) Logout(ctx context.Context, token string) (string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Logout", ctx, token)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Logout indicates an expected call of Logout.
func (mr *MockSessionUsecaseMockRecorder) Logout(ctx, token interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Logout", reflect.TypeOf((*MockSessionUsecase)(nil).Logout), ctx, token)
}

// LogoutFromOIDC mocks base method.
func (m *MockSessionUsecase) LogoutFromOIDC(ctx context.Context, token string) (string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "LogoutFromOIDC", ctx, token)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// LogoutFromOIDC indicates an expected call of LogoutFromOIDC.
func (mr *MockSessionUsecaseMockRecorder) LogoutFromOIDC(ctx, token interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "LogoutFromOIDC", reflect.TypeOf((*MockSessionUsecase)(nil).LogoutFromOIDC), ctx, token)
}

// Signup mocks base method.
func (m *MockSessionUsecase) Signup(ctx context.Context, user *domain.User, accountInfo *domain.OIDCAccountInfo) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Signup", ctx, user, accountInfo)
	ret0, _ := ret[0].(error)
	return ret0
}

// Signup indicates an expected call of Signup.
func (mr *MockSessionUsecaseMockRecorder) Signup(ctx, user, accountInfo interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Signup", reflect.TypeOf((*MockSessionUsecase)(nil).Signup), ctx, user, accountInfo)
}

// Validate mocks base method.
func (m *MockSessionUsecase) Validate(ctx context.Context, token string) (*domain.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Validate", ctx, token)
	ret0, _ := ret[0].(*domain.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Validate indicates an expected call of Validate.
func (mr *MockSessionUsecaseMockRecorder) Validate(ctx, token interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Validate", reflect.TypeOf((*MockSessionUsecase)(nil).Validate), ctx, token)
}

// ValidateOIDC mocks base method.
func (m *MockSessionUsecase) ValidateOIDC(ctx context.Context, token string) (*domain.OIDCAccountInfo, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ValidateOIDC", ctx, token)
	ret0, _ := ret[0].(*domain.OIDCAccountInfo)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ValidateOIDC indicates an expected call of ValidateOIDC.
func (mr *MockSessionUsecaseMockRecorder) ValidateOIDC(ctx, token interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ValidateOIDC", reflect.TypeOf((*MockSessionUsecase)(nil).ValidateOIDC), ctx, token)
}

// VerifyEmail mocks base method.
func (m *MockSessionUsecase) VerifyEmail(ctx context.Context, verifyToken string) (string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "VerifyEmail", ctx, verifyToken)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// VerifyEmail indicates an expected call of VerifyEmail.
func (mr *MockSessionUsecaseMockRecorder) VerifyEmail(ctx, verifyToken interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "VerifyEmail", reflect.TypeOf((*MockSessionUsecase)(nil).VerifyEmail), ctx, verifyToken)
}
