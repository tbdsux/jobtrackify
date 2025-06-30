ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-slim AS slim

# 1. Setup pnpm on the slim base
FROM slim AS base
RUN corepack enable
RUN npm install -g corepack@latest
RUN pnpm config set store-dir ~/.pnpm-store


# 2. Build the project
FROM base AS builder

ENV CI=true

WORKDIR /app

COPY ./ /app

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile

# Build the specified project
RUN pnpm build

# 3. Final image - runner stage to run the application
FROM base AS runner
ARG APP_DIRNAME

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 svelte-kit
USER svelte-kit

WORKDIR /app

# Copy built artifacts from builder stage
COPY --from=builder --chown=svelte-kit:nodejs /app/build ./build
COPY --from=builder --chown=svelte-kit:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=svelte-kit:nodejs /app/package.json ./package.json

ARG PORT=5173
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["node", "build"]