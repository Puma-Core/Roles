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
import { CreateRoleData, RoleRepository } from "../../../../app/infraestructure/roleRepository";
import { RoleService } from "../../../../app/services/roleService";

type RoleServiceTestContext = {
    prisma: PrismaClient;
    tempDirectory: string;
    roleService: RoleService;
};

function createRoleData(id: string, values: Partial<CreateRoleData> = {}): CreateRoleData {
    return {
        name: `integration-role-${id}`,
        scope: "API",
        ...values,
    };
}

function createRoleServiceTestContext(): RoleServiceTestContext {
    const tempDirectory = mkdtempSync(join(tmpdir(), "role-service-integration-"));
    const databasePath = join(tempDirectory, "test.db");
    const migration = readFileSync("app/integrations/prisma/migrations/20260603025332/migration.sql", "utf8");
    const database = new Database(databasePath);

    database.exec(migration);
    database.close();

    const adapter = new PrismaBetterSqlite3({
        url: databasePath,
    });
    const prisma = new PrismaClient({ adapter });
    const roleRepository = new RoleRepository(PrismaRepository, prisma);
    const roleService = new RoleService(roleRepository);

    return { prisma, tempDirectory, roleService };
}

test("RoleService creates a role", async (t) => {
    const { prisma, tempDirectory, roleService } = createRoleServiceTestContext();
    const id = `role-service-create-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await roleService.create(createRoleData(id));

    assert.equal(created.name, `integration-role-${id}`);
    assert.equal(created.scope, "API");
});

test("RoleService gets a role by id", async (t) => {
    const { prisma, tempDirectory, roleService } = createRoleServiceTestContext();
    const id = `role-service-get-by-id-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await roleService.create(createRoleData(id));

    const found = await roleService.getById(created.id);

    assert.notEqual(found, null);
    assert.equal(found?.id, created.id);
});

test("RoleService gets all roles", async (t) => {
    const { prisma, tempDirectory, roleService } = createRoleServiceTestContext();
    const id = `role-service-get-all-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await roleService.create(createRoleData(id));

    const roles = await roleService.getAll();

    assert.equal(roles.some((role) => role.id === created.id), true);
});

test("RoleService updates a role", async (t) => {
    const { prisma, tempDirectory, roleService } = createRoleServiceTestContext();
    const id = `role-service-update-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await roleService.create(createRoleData(id));

    const updated = await roleService.update(created.id, { name: "updated-role", scope: "ADMIN" });

    assert.equal(updated.name, "updated-role");
    assert.equal(updated.scope, "ADMIN");
});

test("RoleService deletes a role", async (t) => {
    const { prisma, tempDirectory, roleService } = createRoleServiceTestContext();
    const id = `role-service-delete-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await roleService.create(createRoleData(id));

    await roleService.delete(created.id);

    const deleted = await roleService.getById(created.id);

    assert.equal(deleted, null);
});
