FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
# Increase memory limit for build process
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm run build

# Prune dev dependencies
RUN pnpm prune --prod

# --- Runner Stage ---
FROM node:22-alpine AS runner

WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy local data file if it exists (for initial state), but volume will mount over it
COPY src/lib/data.json ./src/lib/data.json

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV ORIGIN=http://localhost:3000

# Start command
CMD ["node", "build"]
