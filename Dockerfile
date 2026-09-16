# --- Stage 1: deps ---
# Separate stage just for installing dependencies, so this layer is
# cached independently from source code changes.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Stage 2: builder ---
# Builds the Next.js app. NEXT_PUBLIC_* vars must be present HERE,
# at build time — Next.js inlines them into the client bundle during
# `next build`, not when the container starts. Passed in via
# --build-arg (see docker-compose.yml / GitHub Actions workflow).
FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Stage 3: runner ---
# Next.js "standalone" output (see next.config.ts) copies only the
# files actually needed to run the server — not the full node_modules.
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV INTERNAL_API_URL=http://api:3000/api/v1

# Non-root user — good practice for anything facing the internet.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# standalone output generates its own minimal server.js entrypoint.
CMD ["node", "server.js"]