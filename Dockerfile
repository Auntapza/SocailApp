# Use official Node.js image as base
FROM node:23-alpine3.20

# Set working directory
WORKDIR /socialApp

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app for production
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the app in production using 'vite preview'
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]
