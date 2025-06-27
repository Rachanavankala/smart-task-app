# Stage 1: Use an official Node.js image as the base.
# We choose a specific version for consistency (e.g., Node 18).
# The 'alpine' version is a very small, secure version of Linux.
FROM node:18-alpine

# Set the working directory inside the container.
# This is where our application code will live.
WORKDIR /app

# Copy the package.json and package-lock.json files first.
# This is a Docker optimization. It allows Docker to cache the installed
# node_modules unless these files change.
COPY package*.json ./

# Install the application dependencies inside the container.
RUN npm install

# Copy the rest of our application's source code into the container.
COPY . .

# Tell Docker that our application will listen on port 5000.
# Note: This is for documentation; it doesn't actually open the port.
EXPOSE 5000

# The command to run when the container starts.
# This will start our Node.js server.
CMD [ "node", "server.js" ]