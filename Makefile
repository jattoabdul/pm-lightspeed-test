up:
	docker-compose up --build

down:
	docker-compose down

test:
	docker-compose exec -e "NODE_ENV=test" pm-lightspeed yarn run test

