// Code generated by MockGen. DO NOT EDIT.
// Source: internal/oidc/oidc.go

// Package oidc is a generated GoMock package.
package oidc

import (
	context "context"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
)

// MockAuthenticator is a mock of Authenticator interface.
type MockAuthenticator struct {
	ctrl     *gomock.Controller
	recorder *MockAuthenticatorMockRecorder
}

// MockAuthenticatorMockRecorder is the mock recorder for MockAuthenticator.
type MockAuthenticatorMockRecorder struct {
	mock *MockAuthenticator
}

// NewMockAuthenticator creates a new mock instance.
func NewMockAuthenticator(ctrl *gomock.Controller) *MockAuthenticator {
	mock := &MockAuthenticator{ctrl: ctrl}
	mock.recorder = &MockAuthenticatorMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockAuthenticator) EXPECT() *MockAuthenticatorMockRecorder {
	return m.recorder
}

// Callback mocks base method.
func (m *MockAuthenticator) Callback(ctx context.Context, expectedState, actualState, code string) (*AuthResult, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Callback", ctx, expectedState, actualState, code)
	ret0, _ := ret[0].(*AuthResult)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Callback indicates an expected call of Callback.
func (mr *MockAuthenticatorMockRecorder) Callback(ctx, expectedState, actualState, code interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Callback", reflect.TypeOf((*MockAuthenticator)(nil).Callback), ctx, expectedState, actualState, code)
}

// Login mocks base method.
func (m *MockAuthenticator) Login(ctx context.Context) (string, string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Login", ctx)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(string)
	ret2, _ := ret[2].(error)
	return ret0, ret1, ret2
}

// Login indicates an expected call of Login.
func (mr *MockAuthenticatorMockRecorder) Login(ctx interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Login", reflect.TypeOf((*MockAuthenticator)(nil).Login), ctx)
}

// Logout mocks base method.
func (m *MockAuthenticator) Logout(ctx context.Context) (string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Logout", ctx)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Logout indicates an expected call of Logout.
func (mr *MockAuthenticatorMockRecorder) Logout(ctx interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Logout", reflect.TypeOf((*MockAuthenticator)(nil).Logout), ctx)
}
