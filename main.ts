import "dotenv/config";
import Fastify from "fastify";
import { prismaPlugin } from "./app/integrations/prisma/prismaPlugin";

const server = Fastify({
    logger: true,
});

server.register(prismaPlugin);

server.get("/health-check", async () => {
    return { status: "ok" };
});

async function start(): Promise<void> {
    const port = Number(process.env.FASTIFY_PORT ?? 3000);

    await server.listen({ port, host: "0.0.0.0" });
}

start().catch((error) => {
    server.log.error(error);
    process.exit(1);
});
