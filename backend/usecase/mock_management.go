// Code generated by MockGen. DO NOT EDIT.
// Source: usecase/management.go

// Package usecase is a generated GoMock package.
package usecase

import (
	context "context"
	reflect "reflect"

	domain "github.com/MISW/Portal/backend/domain"
	gomock "github.com/golang/mock/gomock"
)

// MockManagementUsecase is a mock of ManagementUsecase interface.
type MockManagementUsecase struct {
	ctrl     *gomock.Controller
	recorder *MockManagementUsecaseMockRecorder
}

// MockManagementUsecaseMockRecorder is the mock recorder for MockManagementUsecase.
type MockManagementUsecaseMockRecorder struct {
	mock *MockManagementUsecase
}

// NewMockManagementUsecase creates a new mock instance.
func NewMockManagementUsecase(ctrl *gomock.Controller) *MockManagementUsecase {
	mock := &MockManagementUsecase{ctrl: ctrl}
	mock.recorder = &MockManagementUsecaseMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockManagementUsecase) EXPECT() *MockManagementUsecaseMockRecorder {
	return m.recorder
}

// AddPaymentStatus mocks base method.
func (m *MockManagementUsecase) AddPaymentStatus(ctx context.Context, userID, period, authorizer int) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "AddPaymentStatus", ctx, userID, period, authorizer)
	ret0, _ := ret[0].(error)
	return ret0
}

// AddPaymentStatus indicates an expected call of AddPaymentStatus.
func (mr *MockManagementUsecaseMockRecorder) AddPaymentStatus(ctx, userID, period, authorizer interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "AddPaymentStatus", reflect.TypeOf((*MockManagementUsecase)(nil).AddPaymentStatus), ctx, userID, period, authorizer)
}

// AuthorizeTransaction mocks base method.
func (m *MockManagementUsecase) AuthorizeTransaction(ctx context.Context, token string, authorizer int) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "AuthorizeTransaction", ctx, token, authorizer)
	ret0, _ := ret[0].(error)
	return ret0
}

// AuthorizeTransaction indicates an expected call of AuthorizeTransaction.
func (mr *MockManagementUsecaseMockRecorder) AuthorizeTransaction(ctx, token, authorizer interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "AuthorizeTransaction", reflect.TypeOf((*MockManagementUsecase)(nil).AuthorizeTransaction), ctx, token, authorizer)
}

// DeletePaymentStatus mocks base method.
func (m *MockManagementUsecase) DeletePaymentStatus(ctx context.Context, userID, period int) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeletePaymentStatus", ctx, userID, period)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeletePaymentStatus indicates an expected call of DeletePaymentStatus.
func (mr *MockManagementUsecaseMockRecorder) DeletePaymentStatus(ctx, userID, period interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeletePaymentStatus", reflect.TypeOf((*MockManagementUsecase)(nil).DeletePaymentStatus), ctx, userID, period)
}

// GetPaymentStatus mocks base method.
func (m *MockManagementUsecase) GetPaymentStatus(ctx context.Context, userID, period int) (*domain.PaymentStatus, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetPaymentStatus", ctx, userID, period)
	ret0, _ := ret[0].(*domain.PaymentStatus)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetPaymentStatus indicates an expected call of GetPaymentStatus.
func (mr *MockManagementUsecaseMockRecorder) GetPaymentStatus(ctx, userID, period interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetPaymentStatus", reflect.TypeOf((*MockManagementUsecase)(nil).GetPaymentStatus), ctx, userID, period)
}

// GetPaymentStatusesForUser mocks base method.
func (m *MockManagementUsecase) GetPaymentStatusesForUser(ctx context.Context, userID int) ([]*domain.PaymentStatus, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetPaymentStatusesForUser", ctx, userID)
	ret0, _ := ret[0].([]*domain.PaymentStatus)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetPaymentStatusesForUser indicates an expected call of GetPaymentStatusesForUser.
func (mr *MockManagementUsecaseMockRecorder) GetPaymentStatusesForUser(ctx, userID interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetPaymentStatusesForUser", reflect.TypeOf((*MockManagementUsecase)(nil).GetPaymentStatusesForUser), ctx, userID)
}

// GetUser mocks base method.
func (m *MockManagementUsecase) GetUser(ctx context.Context, userID int) (*domain.UserPaymentStatus, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetUser", ctx, userID)
	ret0, _ := ret[0].(*domain.UserPaymentStatus)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetUser indicates an expected call of GetUser.
func (mr *MockManagementUsecaseMockRecorder) GetUser(ctx, userID interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetUser", reflect.TypeOf((*MockManagementUsecase)(nil).GetUser), ctx, userID)
}

// ListUsers mocks base method.
func (m *MockManagementUsecase) ListUsers(ctx context.Context, period int) ([]*domain.UserPaymentStatus, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListUsers", ctx, period)
	ret0, _ := ret[0].([]*domain.UserPaymentStatus)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListUsers indicates an expected call of ListUsers.
func (mr *MockManagementUsecaseMockRecorder) ListUsers(ctx, period interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListUsers", reflect.TypeOf((*MockManagementUsecase)(nil).ListUsers), ctx, period)
}

// RemindPayment mocks base method.
func (m *MockManagementUsecase) RemindPayment(ctx context.Context, filter []int) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "RemindPayment", ctx, filter)
	ret0, _ := ret[0].(error)
	return ret0
}

// RemindPayment indicates an expected call of RemindPayment.
func (mr *MockManagementUsecaseMockRecorder) RemindPayment(ctx, filter interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "RemindPayment", reflect.TypeOf((*MockManagementUsecase)(nil).RemindPayment), ctx, filter)
}

// UpdateRole mocks base method.
func (m *MockManagementUsecase) UpdateRole(ctx context.Context, userID int, role domain.RoleType) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateRole", ctx, userID, role)
	ret0, _ := ret[0].(error)
	return ret0
}

// UpdateRole indicates an expected call of UpdateRole.
func (mr *MockManagementUsecaseMockRecorder) UpdateRole(ctx, userID, role interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateRole", reflect.TypeOf((*MockManagementUsecase)(nil).UpdateRole), ctx, userID, role)
}

// UpdateUser mocks base method.
func (m *MockManagementUsecase) UpdateUser(ctx context.Context, user *domain.User) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateUser", ctx, user)
	ret0, _ := ret[0].(error)
	return ret0
}

// UpdateUser indicates an expected call of UpdateUser.
func (mr *MockManagementUsecaseMockRecorder) UpdateUser(ctx, user interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateUser", reflect.TypeOf((*MockManagementUsecase)(nil).UpdateUser), ctx, user)
}
