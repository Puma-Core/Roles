import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import Database from "better-sqlite3";
import "dotenv/config";

const rawUrl = process.env.PRISMA_DATASOURCE_URL ?? "file:./app/integrations/prisma/dev.db";
const relativePath = rawUrl.replace(/^file:/, "");
const dbPath = resolve(process.cwd(), relativePath);

const database = new Database(dbPath);

const sql = readFileSync("app/integrations/prisma/mock-data.sql", "utf8");

database.exec(sql);
database.close();

console.log(`Seed data loaded successfully into ${dbPath}`);
