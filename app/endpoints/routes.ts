import { FastifyPluginAsync } from "fastify";
import { OperationRepository } from "../infraestructure/operationRepository";
import { PrismaRepository } from "../infraestructure/prisma/prismaRepository";
import { prisma } from "../integrations/prisma/prismaClient";
import { OperationService } from "../services/operationService";
import { OperationRoutes } from "./operationRoutes";

export const routes: FastifyPluginAsync = async (server) => {
    // Operation dependencies
    const operationRepository = new OperationRepository(PrismaRepository, prisma);
    const operationService = new OperationService(operationRepository);
    const operationRoutes = new OperationRoutes(operationService);

    operationRoutes.register(server);

    

};
