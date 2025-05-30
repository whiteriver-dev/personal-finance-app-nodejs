# Use an official Node runtime as the base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your app source code
COPY . .

# Expose backend port
EXPOSE 5050

# Start the app
CMD ["node", "server.js"]