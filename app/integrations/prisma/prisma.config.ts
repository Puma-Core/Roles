import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: process.env.PRISMA_CONFIG_PATH ?? "./",

  migrations: {
    path: process.env.PRISMA_MIGRATIONS_PATH ?? "./app/integrations/prisma/migrations",
  },

  datasource: {
    url: process.env.PRISMA_DATASOURCE_URL ?? "file:./dev.db",
  },
});
