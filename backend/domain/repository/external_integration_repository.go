package repository

// ExternalIntegrationRepository is a repository to provide features to external services
type ExternalIntegrationRepository interface {
	// GetUserRole finds a user by slack id and returns his/her role
	GetUserRoleFromSlackID(slackID string) (string, error)
}
