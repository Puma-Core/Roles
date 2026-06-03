import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./",

  migrations: {
    path: "./migrations",
  },

  datasource: {
    url: process.env.PRISMA_DATASOURCE_URL ?? `file:${process.cwd()}/app/integrations/prisma/dev.db`,
  },
});
