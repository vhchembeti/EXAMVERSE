# Multi-Stage Production Dockerfile for EXAMVERSE
# Target: Render.com Containerized Free Tier or Local Docker

# Stage 1: Build Frontend SPA
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Production Server Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install server dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server codebase and data
COPY server/ ./server/
COPY render.yaml ./

# Copy compiled frontend SPA from builder stage
COPY --from=client-builder /app/client/dist ./client/dist

# Expose port and configure container healthcheck
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server/index.js"]
