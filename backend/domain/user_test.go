package domain

import "testing"

func TestGetNewRole(t *testing.T) {
	for i := range Roles {
		for j := 0; j < 4; j++ {
			newRole := Roles[i].GetNewRole(j&1 != 0, j&2 != 0)

			if Roles[i] == Admin ||
				Roles[i] == Retired ||
				Roles[i] == EmailUnverified {
				if Roles[i] != newRole {
					t.Fatalf("must be same role: %v -> %v", Roles[i], newRole)
				}
			}
		}
	}
}
