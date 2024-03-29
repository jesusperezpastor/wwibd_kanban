# Use an official Node.js runtime as a parent image
FROM node:18

# Expose the port that the app will listen on
EXPOSE 8080

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Angular application
RUN npm run build

# Start the application
CMD ["npm", "run", "serve"]
