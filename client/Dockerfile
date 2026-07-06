# Development Dockerfile for Vite React App
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# We don't copy package.json right away here because you haven't initialized the React app yet.
# Once you run `npm create vite@latest`, the package.json will be present and the volume mount
# in docker-compose.yml will handle syncing the files.

# Expose the port Vite runs on
EXPOSE 5173

# The command is handled in docker-compose.yml, but we provide a default here
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
