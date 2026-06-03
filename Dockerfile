FROM node:24.5.0-bookworm-slim

WORKDIR /app

ENV NODE_ENV=development
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ openssl ca-certificates sqlite3 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate --config app/integrations/prisma/prisma.config.ts

EXPOSE 3012

CMD ["sh", "-c", "npx prisma migrate deploy --config app/integrations/prisma/prisma.config.ts && npm start"]
