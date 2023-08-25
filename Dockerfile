# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /app

COPY . .

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the server folder
COPY server ./server

# Set the environment variable for the server
ENV SERVER_DIR=/app/server

# Copy the frontend build files
COPY build ./build

# Expose the desired ports (adjust if needed)
EXPOSE 3000
EXPOSE 3001

# Start the server and React app
ENTRYPOINT node server/server.js & npm start
