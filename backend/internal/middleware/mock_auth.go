// Code generated by MockGen. DO NOT EDIT.
// Source: internal/middleware/auth.go

// Package middleware is a generated GoMock package.
package middleware

import (
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	echo "github.com/labstack/echo/v4"
)

// MockAuthMiddleware is a mock of AuthMiddleware interface.
type MockAuthMiddleware struct {
	ctrl     *gomock.Controller
	recorder *MockAuthMiddlewareMockRecorder
}

// MockAuthMiddlewareMockRecorder is the mock recorder for MockAuthMiddleware.
type MockAuthMiddlewareMockRecorder struct {
	mock *MockAuthMiddleware
}

// NewMockAuthMiddleware creates a new mock instance.
func NewMockAuthMiddleware(ctrl *gomock.Controller) *MockAuthMiddleware {
	mock := &MockAuthMiddleware{ctrl: ctrl}
	mock.recorder = &MockAuthMiddlewareMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockAuthMiddleware) EXPECT() *MockAuthMiddlewareMockRecorder {
	return m.recorder
}

// Authenticate mocks base method.
func (m *MockAuthMiddleware) Authenticate(next echo.HandlerFunc) echo.HandlerFunc {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Authenticate", next)
	ret0, _ := ret[0].(echo.HandlerFunc)
	return ret0
}

// Authenticate indicates an expected call of Authenticate.
func (mr *MockAuthMiddlewareMockRecorder) Authenticate(next interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Authenticate", reflect.TypeOf((*MockAuthMiddleware)(nil).Authenticate), next)
}
