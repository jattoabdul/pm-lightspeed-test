up:
	docker-compose up --build

down:
	docker-compose down

test:
	docker-compose exec -e "NODE_ENV=test" pm-lightspeed yarn run test

exec:
	docker-compose exec pm-lightspeed-test $(cmd)

deploy:
	git am "deploying to heroku master"
	git push heroku master
