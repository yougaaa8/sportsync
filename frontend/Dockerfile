# Simple Next.js Dockerfile that should work
FROM node:18-alpine

# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application on port 5173
CMD ["npx", "next", "start", "-p", "5173"]