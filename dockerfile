# Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Globally install Nest CLI to use for building
RUN npm install -g @nestjs/cli

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Final Stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set the environment to production
ENV NODE_ENV production

# Command to run the application in production
CMD ["npm", "run", "start:prod"]

# Optional: If using Docker Compose for local development
# docker compose  -f "docker-compose.yaml" up -d --build mongo
