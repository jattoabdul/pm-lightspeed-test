up:
    docker-compose up --build
down:
    docker-compose down
test:
    docker-compose run -e "RAILS_ENV=test" pm-lightspeed-test yarn run test -f d
clean:
    @echo "Cleaning..."
exec:
    docker-compose exec pm-lightspeed-test $(cmd)
bash:
    docker-compose exec pm-lightspeed-test bash
deploy:
    git am 'deploy: deploying to heroku master'
    git push heroku master
