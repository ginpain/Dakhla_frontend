FROM node:20 AS base

# Stage 1: Install dependencies

FROM base AS deps

WORKDIR /src

COPY package.json .
RUN npm install

# Stage 2: Build the application

FROM base AS builder
WORKDIR /src
COPY --from=deps /src/node_modules ./node_modules
COPY . .

RUN npx prisma generate  
RUN npm run build


# Stage 3: Production server

FROM base AS runner
WORKDIR /src
ENV NODE_ENV=production

COPY --from=builder /src/public ./public
COPY --from=builder /src/.next/standalone ./
COPY --from=builder /src/.next/static ./.next/static

EXPOSE 3000


# CMD ["node", "server.js"]

CMD HOSTNAME="0.0.0.0" node server.js