package repository

// ExternalIntegrationRepository is a repository to provide features to external services
type ExternalIntegrationRepository interface {
	// GetUserRole finds a user by account id and returns his/her role
	GetUserRoleFromAccountID(accountID string) (string, error)
}
