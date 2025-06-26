# Frontend Dockerfile (Dev Only)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install all deps
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Vite dev server port (default is 5173)
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
