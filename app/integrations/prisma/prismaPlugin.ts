import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import { prisma } from "./prismaClient";

declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

export const prismaPlugin: FastifyPluginAsync = async (server) => {
    server.decorate("prisma", prisma);

    server.addHook("onReady", async () => {
        await prisma.$connect();
    });

    server.addHook("onClose", async () => {
        await prisma.$disconnect();
    });
};
