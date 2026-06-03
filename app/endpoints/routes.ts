import { FastifyPluginAsync } from "fastify";
import { OperationRepository } from "../infraestructure/operationRepository";
import { PrismaRepository } from "../infraestructure/prisma/prismaRepository";
import { UserRepository } from "../infraestructure/userRepository";
import { prisma } from "../integrations/prisma/prismaClient";
import { OperationService } from "../services/operationService";
import { UserService } from "../services/userService";
import { OperationRoutes } from "./operationRoutes";
import { UserRoutes } from "./userRoutes";

export const routes: FastifyPluginAsync = async (server) => {
    // Add Repository Instances
    const operationRepository = new OperationRepository(PrismaRepository, prisma);
    const userRepository = new UserRepository(PrismaRepository, prisma);

    // Add Service Instances
    const operationService = new OperationService(operationRepository);
    const userService = new UserService(userRepository);

    // Add Routes
    const operationRoutes = new OperationRoutes(operationService);
    const userRoutes = new UserRoutes(userService);

    // Register routes
    operationRoutes.register(server);
    userRoutes.register(server);
};
