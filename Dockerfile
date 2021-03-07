FROM node:12.18.0-alpine

RUN apk update && apk add --no-cache bash

# Create app directory
WORKDIR /usr/src/pm-lightspeed

# Install app dependencies
COPY package*.json ./
RUN npm install

# Uninstall the current bcrypt modules
RUN npm uninstall bcrypt

# Install the bcrypt modules for the machine
RUN npm install bcrypt

# Audit Packages
RUN npm audit fix --force

# Copy app source code
COPY . .

# Expose port
EXPOSE 3000

# Generate build
RUN npm run build

# Start application
CMD [ "npm", "start" ]
