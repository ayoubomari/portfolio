# Use Node.js LTS as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your application files
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Set environment variables for production (optional or can use Docker Compose)
ENV NODE_ENV=production

# Build the Next.js application
RUN npm run build

# Start the custom Express server
CMD ["npm", "run", "start"]
