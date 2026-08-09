FROM node:20-bookworm-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm npm ci

FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_ENABLE_DEMO_LOGIN=true
ARG NEXT_PUBLIC_DEMO_ADMIN_PASSWORD=Password123!
ARG NEXT_PUBLIC_DEMO_STAFF_PASSWORD=Password123!
ENV NEXT_PUBLIC_ENABLE_DEMO_LOGIN=$NEXT_PUBLIC_ENABLE_DEMO_LOGIN
ENV NEXT_PUBLIC_DEMO_ADMIN_PASSWORD=$NEXT_PUBLIC_DEMO_ADMIN_PASSWORD
ENV NEXT_PUBLIC_DEMO_STAFF_PASSWORD=$NEXT_PUBLIC_DEMO_STAFF_PASSWORD
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN --mount=type=cache,target=/app/.next/cache npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node_modules/.bin/next", "start"]
