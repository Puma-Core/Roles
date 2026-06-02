import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./app/integrations/prisma/config.prisma",

  migrations: {
    path: "./app/integrations/prisma/migrations",
  },

  datasource: {
    url: "file:./dev.db",
  },
});