import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const datasourceUrl = process.env.PRISMA_DATASOURCE_URL === "file:./dev.db"
    ? "file:./app/integrations/prisma/dev.db"
    : process.env.PRISMA_DATASOURCE_URL ?? "file:./app/integrations/prisma/dev.db";

const adapter = new PrismaBetterSqlite3({
    url: datasourceUrl,
});

export const prisma = new PrismaClient({ adapter });
