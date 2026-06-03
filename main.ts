import "dotenv/config";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import { routes } from "./app/endpoints/routes";
import { prisma } from "./app/integrations/prisma/prismaClient";
import { prismaPlugin } from "./app/integrations/prisma/prismaPlugin";
import { registerSwagger } from "./app/integrations/swagger/swaggerPlugin";

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        prisma: typeof prisma;
    }
}

const server = Fastify({
    logger: true,
});

server.decorate("prisma", prisma);

const startFastify = async () => {
    await server.register(prismaPlugin);
    await registerSwagger(server);
    await server.register(cors);
    await server.register(jwt, {
        secret: process.env.JWT_SECRET ?? "development-secret",
    });

    await server.register(routes);

    async function start(): Promise<void> {
        const port = Number(process.env.FASTIFY_PORT ?? 3000);

        await server.listen({ port, host: "0.0.0.0" });
    }
    await start();

}

startFastify()


