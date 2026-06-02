import "dotenv/config";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import { PrismaRepository } from "../../../../app/infraestructure/prisma/prismaRepository";
import { CreateOperationData, OperationRepository } from "../../../../app/infraestructure/operationRepository";
import { OperationService } from "../../../../app/services/operationService";

type OperationServiceTestContext = {
    prisma: PrismaClient;
    tempDirectory: string;
    operationService: OperationService;
};

function createOperationData(id: string, values: Partial<CreateOperationData> = {}): CreateOperationData {
    return {
        id,
        label: "Integration Operation",
        name: `integration-operation-${id}`,
        tool: "integration-tool",
        operation: ["CREATE"],
        ...values,
    };
}

function createOperationServiceTestContext(): OperationServiceTestContext {
    const tempDirectory = mkdtempSync(join(tmpdir(), "operation-service-integration-"));
    const databasePath = join(tempDirectory, "test.db");
    const migration = readFileSync("app/integrations/prisma/migrations/20260602203722_tortilla/migration.sql", "utf8");
    const database = new Database(databasePath);

    database.exec(migration);
    database.close();

    const adapter = new PrismaBetterSqlite3({
        url: databasePath,
    });
    const prisma = new PrismaClient({ adapter });
    const operationRepository = new OperationRepository(PrismaRepository, prisma);
    const operationService = new OperationService(operationRepository);

    return { prisma, tempDirectory, operationService };
}

test("OperationService creates an operation", async (t) => {
    const { prisma, tempDirectory, operationService } = createOperationServiceTestContext();
    const id = `operation-service-create-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await operationService.create(createOperationData(id));

    assert.equal(created.id, id);
    assert.equal(created.label, "Integration Operation");
});

test("OperationService gets an operation by id", async (t) => {
    const { prisma, tempDirectory, operationService } = createOperationServiceTestContext();
    const id = `operation-service-get-by-id-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    await operationService.create(createOperationData(id));

    const found = await operationService.getById(id);

    assert.notEqual(found, null);
    assert.equal(found?.id, id);
});

test("OperationService gets all operations", async (t) => {
    const { prisma, tempDirectory, operationService } = createOperationServiceTestContext();
    const id = `operation-service-get-all-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    await operationService.create(createOperationData(id));

    const operations = await operationService.getAll();

    assert.equal(operations.some((operation) => operation.id === id), true);
});

test("OperationService updates an operation", async (t) => {
    const { prisma, tempDirectory, operationService } = createOperationServiceTestContext();
    const id = `operation-service-update-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    await operationService.create(createOperationData(id));

    const updated = await operationService.update(id, { label: "Updated Operation", operation: ["READ"] });

    assert.equal(updated.label, "Updated Operation");
    assert.deepEqual(updated.operation, ["READ"]);
});

test("OperationService deletes an operation", async (t) => {
    const { prisma, tempDirectory, operationService } = createOperationServiceTestContext();
    const id = `operation-service-delete-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    await operationService.create(createOperationData(id));

    await operationService.delete(id);

    const deleted = await operationService.getById(id);

    assert.equal(deleted, null);
});
