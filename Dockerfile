# Use Node.js LTS version
FROM node:lts

# Create app directory
WORKDIR /usr/src

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Environment Parameters
ENV DISCORD_TOKEN=your-discord-token

# Expose the port
EXPOSE 3000

# Command to run your app
CMD ["node", "index.js"]
