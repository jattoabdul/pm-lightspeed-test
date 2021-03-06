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
> - TODO

#### Services (job queues, cache servers, search engines, etc.)
>- Redis - For Caching & Session Persistence

#### Deployment
> - TODO

#### LICENSE
>- [MIT License](https://github.com/jattoabdul/andela-bootcamp-postit/blob/master/LICENSE)

#### Author(s)
>- [Aminujatto Abdulqahhar](https://github.com/jattoabdul)
