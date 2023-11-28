FROM node:20.9.0

WORKDIR /app

# Copy all files from the current directory to the /app directory in the container
COPY . .

RUN npm install

# Run the build script to transpile TypeScript to JavaScript
RUN npm run build

# Specify the command to run the Node.js application
CMD [ "node", "build/index.js" ]

# Expose port 5000
EXPOSE 5000

#docker run --publish 5000:5000/tcp --mount type=bind,source="$(pwd)/db",target=/app/db users-api:v1

