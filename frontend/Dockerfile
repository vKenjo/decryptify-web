FROM node:18-bullseye

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ gcc libc6-dev curl && rm -rf /var/lib/apt/lists/*

# Install Rust toolchain for native bindings
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Set environment variables for Tailwind Oxide
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
