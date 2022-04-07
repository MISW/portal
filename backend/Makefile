.PHONY: ci-test
ci-test:
	go mod tidy || go test -race -tags use_external_db -v ./...

init:
	(cd $(mktemp -d); GO111MODULE=on \
		go get github.com/golang/mock/mockgen@v1.6.0 \
	)
