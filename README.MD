# Palindrome Messages ⚡️ LightSpeed Test

A simple REST API that supports the storage and retrieval of messages (strings), and
provides the ability to determine whether a message is a palindrome.

#### API Documentation
The Postman API Documentation can be found [here](https://documenter.getpostman.com/view/1203729/Tz5jdKar)

#### Acceptance Criteria
There should be:

- Users who can
    - signup/login
    - manage messages (add, remove, edit, view)
    - view palindrome messages
    - test if a message is a palindrome by the messageID or text (i.e. existing or random messages)
- Only the palindrome test API should be available to the public.

#### System dependencies (Tools/Stack)
> - Node
> - MongoDB
> - Redis
> - Docker
> - POSTMAN
> - Jest
> - Express
> - Eslint

#### To get started
> - Ensure MongoDB is running properly
> - Start Redis Server: `$ redis-server`
> - Copy and Update Environment Variable: `cp .env.sample .env && cp .env.sample .env.docker`
> - Install Dependencies: `$ yarn install`
> - Create and Setup Database: `$ `
> - Migrate DB: `$ `
> - Start Application Server `$ yarn dev`
> - To test with ngrok, start a tunnel with: `$ ngrok http 3000`
> - Access App on `http://localhost:3000` or via ngrok on generated URL

#### How to run the test suite
>  `$ yarn run test`

#### How to run linter
>  `$ yarn lint`

#### To get started with Docker
> - Install Docker
> - TO Start Containers, Run `$ docker-compose up --build`
> - To Stop Containers, Run: `$ docker-compose down`
> ##### To Use Shell Script
> - Give Start Shell Script Access: `$ chmod +x start.sh`
> - To See Start Shell Script Commands, Run: `$ ./start.sh -h`
> - TO Start Containers, Run `$ ./start.sh run`
> - To Stop Containers, Run: `$ ./start.sh stop`
> - To Clean Containers, Run: `$ ./start.sh clean`
> ##### To Use Make
> - TO Start Containers, Run `$ make up`
> - To Stop Containers, Run: `$ make down`

#### How to run the test suite in Docker
> - Run `$ docker-compose exec -e "NODE_ENV=test" pm-lightspeed yarn run test`
> ##### To Use Make
> - Run `$ make test`

#### Services (job queues, cache servers, search engines, etc.)
>- Redis - For Caching & Session Persistence

#### Deployment
> - Automatic deployment is set up for the project when you push to master or merge a PR to master
> - A deployment is made to the staging environment and this can then be promoted to production after proper QA.
> - When you raise a PR against the master branch, A review app is deployed on Heroku for the branch that raised the PR.
> ##### Manual Deployment instructions for Heroku
> - Add the Heroku remote locally `$ git remote add heroku ${heroku_git_url}`
> - Add and Commit to Git `$ git am 'deploy: deploying to heroku'`
> - `$ git push heroku master`
> ##### To Use Make for manual deployment to Heroku
> - Run `$ make deploy`

#### LICENSE
>- [MIT License](https://github.com/jattoabdul/andela-bootcamp-postit/blob/master/LICENSE)

#### Author(s)
>- [Aminujatto Abdulqahhar](https://github.com/jattoabdul)
