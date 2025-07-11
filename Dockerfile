# Use official Node.js image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build the Next.js app
RUN npm run build

# Production image
FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=base /app ./

ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
