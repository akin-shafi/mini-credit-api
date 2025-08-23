FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install only production deps
COPY package*.json ./
# RUN npm install --only=production
RUN npm install



# Copy all source code
COPY . .

# Build TypeScript
RUN npm run build


# Expose API port
EXPOSE 3000

# Run production build
CMD ["npm", "start"]


# Set build-time arg
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/src/app

COPY package*.json ./

# Install all deps if dev, only prod deps otherwise
RUN if [ "$NODE_ENV" = "development" ]; then npm install; else npm install --only=production; fi

COPY . .

