# Base image
FROM node:23-alpine3.20

# Set working directory
WORKDIR /socialAppApi

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npm install typescript --save-dev

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build project
RUN npx tsc -b

# Expose port
EXPOSE 4000

# Start app
CMD ["node", "./dist/index.js"]
