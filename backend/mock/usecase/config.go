// Code generated by MockGen. DO NOT EDIT.
// Source: usecase/config.go

// Package usecase is a generated GoMock package.
package usecase

import (
	reflect "reflect"

	domain "github.com/MISW/Portal/backend/domain"
	gomock "github.com/golang/mock/gomock"
)

// MockAppConfigUsecase is a mock of AppConfigUsecase interface.
type MockAppConfigUsecase struct {
	ctrl     *gomock.Controller
	recorder *MockAppConfigUsecaseMockRecorder
}

// MockAppConfigUsecaseMockRecorder is the mock recorder for MockAppConfigUsecase.
type MockAppConfigUsecaseMockRecorder struct {
	mock *MockAppConfigUsecase
}

// NewMockAppConfigUsecase creates a new mock instance.
func NewMockAppConfigUsecase(ctrl *gomock.Controller) *MockAppConfigUsecase {
	mock := &MockAppConfigUsecase{ctrl: ctrl}
	mock.recorder = &MockAppConfigUsecaseMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockAppConfigUsecase) EXPECT() *MockAppConfigUsecaseMockRecorder {
	return m.recorder
}

// GetCurrentPeriod mocks base method.
func (m *MockAppConfigUsecase) GetCurrentPeriod() (int, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetCurrentPeriod")
	ret0, _ := ret[0].(int)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetCurrentPeriod indicates an expected call of GetCurrentPeriod.
func (mr *MockAppConfigUsecaseMockRecorder) GetCurrentPeriod() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetCurrentPeriod", reflect.TypeOf((*MockAppConfigUsecase)(nil).GetCurrentPeriod))
}

// GetEmailTemplate mocks base method.
func (m *MockAppConfigUsecase) GetEmailTemplate(kind domain.EmailKind) (string, string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEmailTemplate", kind)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(string)
	ret2, _ := ret[2].(error)
	return ret0, ret1, ret2
}

// GetEmailTemplate indicates an expected call of GetEmailTemplate.
func (mr *MockAppConfigUsecaseMockRecorder) GetEmailTemplate(kind interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEmailTemplate", reflect.TypeOf((*MockAppConfigUsecase)(nil).GetEmailTemplate), kind)
}

// GetPaymentPeriod mocks base method.
func (m *MockAppConfigUsecase) GetPaymentPeriod() (int, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetPaymentPeriod")
	ret0, _ := ret[0].(int)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetPaymentPeriod indicates an expected call of GetPaymentPeriod.
func (mr *MockAppConfigUsecaseMockRecorder) GetPaymentPeriod() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetPaymentPeriod", reflect.TypeOf((*MockAppConfigUsecase)(nil).GetPaymentPeriod))
}

// SetCurrentPeriod mocks base method.
func (m *MockAppConfigUsecase) SetCurrentPeriod(period int) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "SetCurrentPeriod", period)
	ret0, _ := ret[0].(error)
	return ret0
}

// SetCurrentPeriod indicates an expected call of SetCurrentPeriod.
func (mr *MockAppConfigUsecaseMockRecorder) SetCurrentPeriod(period interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SetCurrentPeriod", reflect.TypeOf((*MockAppConfigUsecase)(nil).SetCurrentPeriod), period)
}

// SetEmailTemplate mocks base method.
func (m *MockAppConfigUsecase) SetEmailTemplate(kind domain.EmailKind, subject, body string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "SetEmailTemplate", kind, subject, body)
	ret0, _ := ret[0].(error)
	return ret0
}

// SetEmailTemplate indicates an expected call of SetEmailTemplate.
func (mr *MockAppConfigUsecaseMockRecorder) SetEmailTemplate(kind, subject, body interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SetEmailTemplate", reflect.TypeOf((*MockAppConfigUsecase)(nil).SetEmailTemplate), kind, subject, body)
}

// SetPaymentPeriod mocks base method.
func (m *MockAppConfigUsecase) SetPaymentPeriod(period int) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "SetPaymentPeriod", period)
	ret0, _ := ret[0].(error)
	return ret0
}

// SetPaymentPeriod indicates an expected call of SetPaymentPeriod.
func (mr *MockAppConfigUsecaseMockRecorder) SetPaymentPeriod(period interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SetPaymentPeriod", reflect.TypeOf((*MockAppConfigUsecase)(nil).SetPaymentPeriod), period)
}
