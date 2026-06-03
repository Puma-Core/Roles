import { FastifyPluginAsync } from "fastify";
import { prisma } from "./prismaClient";

export const prismaPlugin: FastifyPluginAsync = async (server) => {
    await server.addHook("onReady", async () => {
        await prisma.$connect();
    });

    await server.addHook("onClose", async () => {
        await prisma.$disconnect();
    });
};
