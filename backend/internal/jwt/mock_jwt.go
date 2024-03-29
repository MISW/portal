// Code generated by MockGen. DO NOT EDIT.
// Source: internal/jwt/jwt.go

// Package jwt is a generated GoMock package.
package jwt

import (
	reflect "reflect"

	jwt "github.com/golang-jwt/jwt/v5"
	gomock "github.com/golang/mock/gomock"
)

// MockJWTProvider is a mock of JWTProvider interface.
type MockJWTProvider struct {
	ctrl     *gomock.Controller
	recorder *MockJWTProviderMockRecorder
}

// MockJWTProviderMockRecorder is the mock recorder for MockJWTProvider.
type MockJWTProviderMockRecorder struct {
	mock *MockJWTProvider
}

// NewMockJWTProvider creates a new mock instance.
func NewMockJWTProvider(ctrl *gomock.Controller) *MockJWTProvider {
	mock := &MockJWTProvider{ctrl: ctrl}
	mock.recorder = &MockJWTProviderMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockJWTProvider) EXPECT() *MockJWTProviderMockRecorder {
	return m.recorder
}

// Generate mocks base method.
func (m *MockJWTProvider) Generate(sc *jwt.RegisteredClaims) (string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Generate", sc)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Generate indicates an expected call of Generate.
func (mr *MockJWTProviderMockRecorder) Generate(sc interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Generate", reflect.TypeOf((*MockJWTProvider)(nil).Generate), sc)
}

// GenerateWithMap mocks base method.
func (m *MockJWTProvider) GenerateWithMap(claims map[string]interface{}) (string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GenerateWithMap", claims)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GenerateWithMap indicates an expected call of GenerateWithMap.
func (mr *MockJWTProviderMockRecorder) GenerateWithMap(claims interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GenerateWithMap", reflect.TypeOf((*MockJWTProvider)(nil).GenerateWithMap), claims)
}

// Parse mocks base method.
func (m *MockJWTProvider) Parse(tokenString string) (*jwt.Token, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Parse", tokenString)
	ret0, _ := ret[0].(*jwt.Token)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Parse indicates an expected call of Parse.
func (mr *MockJWTProviderMockRecorder) Parse(tokenString interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Parse", reflect.TypeOf((*MockJWTProvider)(nil).Parse), tokenString)
}

// ParseAs mocks base method.
func (m *MockJWTProvider) ParseAs(tokenString string, as jwt.Claims) (jwt.Claims, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ParseAs", tokenString, as)
	ret0, _ := ret[0].(jwt.Claims)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ParseAs indicates an expected call of ParseAs.
func (mr *MockJWTProviderMockRecorder) ParseAs(tokenString, as interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ParseAs", reflect.TypeOf((*MockJWTProvider)(nil).ParseAs), tokenString, as)
}

// ParseAsMap mocks base method.
func (m *MockJWTProvider) ParseAsMap(tokenString string) (map[string]interface{}, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ParseAsMap", tokenString)
	ret0, _ := ret[0].(map[string]interface{})
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ParseAsMap indicates an expected call of ParseAsMap.
func (mr *MockJWTProviderMockRecorder) ParseAsMap(tokenString interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ParseAsMap", reflect.TypeOf((*MockJWTProvider)(nil).ParseAsMap), tokenString)
}

// ParseAsStandard mocks base method.
func (m *MockJWTProvider) ParseAsStandard(tokenString string) (*jwt.RegisteredClaims, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ParseAsStandard", tokenString)
	ret0, _ := ret[0].(*jwt.RegisteredClaims)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ParseAsStandard indicates an expected call of ParseAsStandard.
func (mr *MockJWTProviderMockRecorder) ParseAsStandard(tokenString interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ParseAsStandard", reflect.TypeOf((*MockJWTProvider)(nil).ParseAsStandard), tokenString)
}
