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
import { TokenRepository } from "../../../../app/infraestructure/tokenRepository";
import { CreateUserData, UserRepository } from "../../../../app/infraestructure/userRepository";
import { TokenService } from "../../../../app/services/tokenService";
import { UserService } from "../../../../app/services/userService";

type UserServiceTestContext = {
    prisma: PrismaClient;
    tempDirectory: string;
    userService: UserService;
};

function createUserData(id: string, values: Partial<CreateUserData> = {}): CreateUserData {
    return {
        username: `integration-user-${id}`,
        firstName: "Integration",
        lastName: "User",
        password: "integration-password",
        age: 30,
        roles: [],
        nationality: "AR",
        ...values,
    };
}

function createUserServiceTestContext(): UserServiceTestContext {
    const tempDirectory = mkdtempSync(join(tmpdir(), "user-service-integration-"));
    const databasePath = join(tempDirectory, "test.db");
    const migration = readFileSync("app/integrations/prisma/migrations/20260602203722_tortilla/migration.sql", "utf8");
    const database = new Database(databasePath);

    database.exec(migration);
    database.close();

    const adapter = new PrismaBetterSqlite3({
        url: databasePath,
    });
    const prisma = new PrismaClient({ adapter });
    const tokenRepository = new TokenRepository(PrismaRepository, prisma);
    const userRepository = new UserRepository(PrismaRepository, prisma);
    const tokenService = new TokenService(tokenRepository);
    const userService = new UserService(userRepository, tokenService);

    return { prisma, tempDirectory, userService };
}

test("UserService creates a user", async (t) => {
    const { prisma, tempDirectory, userService } = createUserServiceTestContext();
    const id = `user-service-create-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await userService.create(createUserData(id));

    assert.equal(created.firstName, "Integration");
    assert.equal(created.username, `integration-user-${id}`);
});

test("UserService gets a user by id", async (t) => {
    const { prisma, tempDirectory, userService } = createUserServiceTestContext();
    const id = `user-service-get-by-id-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await userService.create(createUserData(id));

    const found = await userService.getById(created.id);

    assert.notEqual(found, null);
    assert.equal(found?.id, created.id);
});

test("UserService gets all users", async (t) => {
    const { prisma, tempDirectory, userService } = createUserServiceTestContext();
    const id = `user-service-get-all-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await userService.create(createUserData(id));

    const users = await userService.getAll();
    assert.equal(users.some((user) => user.id === created.id), true);
});

test("UserService updates a user", async (t) => {
    const { prisma, tempDirectory, userService } = createUserServiceTestContext();
    const id = `user-service-update-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await userService.create(createUserData(id));

    const updated = await userService.update(created.id, { firstName: "Updated", age: 31 });

    assert.equal(updated.firstName, "Updated");
    assert.equal(updated.age, 31);
});

test("UserService deletes a user", async (t) => {
    const { prisma, tempDirectory, userService } = createUserServiceTestContext();
    const id = `user-service-delete-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await userService.create(createUserData(id));

    await userService.delete(created.id);

    const deleted = await userService.getById(created.id);

    assert.equal(deleted, null);
});

test("UserService logs in a user", async (t) => {
    const { prisma, tempDirectory, userService } = createUserServiceTestContext();
    const id = `user-service-login-${Date.now()}`;

    t.after(async () => {
        await prisma.$disconnect();
        rmSync(tempDirectory, { recursive: true, force: true });
    });

    const created = await userService.create(createUserData(id));

    const token = await userService.login({
        username: created.username,
        password: "integration-password",
    });

    assert.notEqual(token, null);
    assert.equal(token?.name, "access_token");
    assert.equal(token?.userId, created.id);
});
