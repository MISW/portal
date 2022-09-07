// Code generated by MockGen. DO NOT EDIT.
// Source: appconfig_repository.go

// Package repository is a generated GoMock package.
package repository

import (
	reflect "reflect"

	domain "github.com/MISW/Portal/backend/domain"
	gomock "github.com/golang/mock/gomock"
)

// MockAppConfigRepository is a mock of AppConfigRepository interface.
type MockAppConfigRepository struct {
	ctrl     *gomock.Controller
	recorder *MockAppConfigRepositoryMockRecorder
}

// MockAppConfigRepositoryMockRecorder is the mock recorder for MockAppConfigRepository.
type MockAppConfigRepositoryMockRecorder struct {
	mock *MockAppConfigRepository
}

// NewMockAppConfigRepository creates a new mock instance.
func NewMockAppConfigRepository(ctrl *gomock.Controller) *MockAppConfigRepository {
	mock := &MockAppConfigRepository{ctrl: ctrl}
	mock.recorder = &MockAppConfigRepositoryMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockAppConfigRepository) EXPECT() *MockAppConfigRepositoryMockRecorder {
	return m.recorder
}

// GetCurrentPeriod mocks base method.
func (m *MockAppConfigRepository) GetCurrentPeriod() (int, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetCurrentPeriod")
	ret0, _ := ret[0].(int)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetCurrentPeriod indicates an expected call of GetCurrentPeriod.
func (mr *MockAppConfigRepositoryMockRecorder) GetCurrentPeriod() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetCurrentPeriod", reflect.TypeOf((*MockAppConfigRepository)(nil).GetCurrentPeriod))
}

// GetEmailTemplate mocks base method.
func (m *MockAppConfigRepository) GetEmailTemplate(kind domain.EmailKind) (string, string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEmailTemplate", kind)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(string)
	ret2, _ := ret[2].(error)
	return ret0, ret1, ret2
}

// GetEmailTemplate indicates an expected call of GetEmailTemplate.
func (mr *MockAppConfigRepositoryMockRecorder) GetEmailTemplate(kind interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEmailTemplate", reflect.TypeOf((*MockAppConfigRepository)(nil).GetEmailTemplate), kind)
}

// GetPaymentPeriod mocks base method.
func (m *MockAppConfigRepository) GetPaymentPeriod() (int, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetPaymentPeriod")
	ret0, _ := ret[0].(int)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetPaymentPeriod indicates an expected call of GetPaymentPeriod.
func (mr *MockAppConfigRepositoryMockRecorder) GetPaymentPeriod() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetPaymentPeriod", reflect.TypeOf((*MockAppConfigRepository)(nil).GetPaymentPeriod))
}

// SetCurrentPeriod mocks base method.
func (m *MockAppConfigRepository) SetCurrentPeriod(period int) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "SetCurrentPeriod", period)
	ret0, _ := ret[0].(error)
	return ret0
}

// SetCurrentPeriod indicates an expected call of SetCurrentPeriod.
func (mr *MockAppConfigRepositoryMockRecorder) SetCurrentPeriod(period interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SetCurrentPeriod", reflect.TypeOf((*MockAppConfigRepository)(nil).SetCurrentPeriod), period)
}

// SetEmailTemplate mocks base method.
func (m *MockAppConfigRepository) SetEmailTemplate(kind domain.EmailKind, subject, body string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "SetEmailTemplate", kind, subject, body)
	ret0, _ := ret[0].(error)
	return ret0
}

// SetEmailTemplate indicates an expected call of SetEmailTemplate.
func (mr *MockAppConfigRepositoryMockRecorder) SetEmailTemplate(kind, subject, body interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SetEmailTemplate", reflect.TypeOf((*MockAppConfigRepository)(nil).SetEmailTemplate), kind, subject, body)
}

// SetPaymentPeriod mocks base method.
func (m *MockAppConfigRepository) SetPaymentPeriod(period int) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "SetPaymentPeriod", period)
	ret0, _ := ret[0].(error)
	return ret0
}

// SetPaymentPeriod indicates an expected call of SetPaymentPeriod.
func (mr *MockAppConfigRepositoryMockRecorder) SetPaymentPeriod(period interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SetPaymentPeriod", reflect.TypeOf((*MockAppConfigRepository)(nil).SetPaymentPeriod), period)
}
