.PHONY: init
init:
	test -f dev.env || cp dev.env.template dev.env

.PHONY: seed
seed:
	docker-compose exec mysql bash -c "mysql -u root -proot portal < /seeds/*.sql"
