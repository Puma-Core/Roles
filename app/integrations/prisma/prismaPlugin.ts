import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import { prisma } from "./prismaClient";

declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

export const prismaPlugin: FastifyPluginAsync = async (server) => {
    await server.decorate("prisma", prisma);

    await server.addHook("onReady", async () => {
        await prisma.$connect();
    });

    await server.addHook("onClose", async () => {
        await prisma.$disconnect();
    });
};
