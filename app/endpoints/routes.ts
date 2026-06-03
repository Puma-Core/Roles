import { FastifyPluginAsync } from "fastify";
import { OperationRepository } from "../infraestructure/operationRepository";
import { PrismaRepository } from "../infraestructure/prisma/prismaRepository";
import { RoleRepository } from "../infraestructure/roleRepository";
import { UserRepository } from "../infraestructure/userRepository";
import { prisma } from "../integrations/prisma/prismaClient";
import { OperationService } from "../services/operationService";
import { RoleService } from "../services/roleService";
import { UserService } from "../services/userService";
import { OperationRoutes } from "./operationRoutes";
import { RoleRoutes } from "./roleRoutes";
import { UserRoutes } from "./userRoutes";

export const routes: FastifyPluginAsync = async (server) => {
    // Add Repository Instances
    const operationRepository = new OperationRepository(PrismaRepository, prisma);
    const roleRepository = new RoleRepository(PrismaRepository, prisma);
    const userRepository = new UserRepository(PrismaRepository, prisma);

    // Add Service Instances
    const operationService = new OperationService(operationRepository);
    const roleService = new RoleService(roleRepository);
    const userService = new UserService(userRepository);

    // Add Routes
    const operationRoutes = new OperationRoutes(operationService);
    const roleRoutes = new RoleRoutes(roleService);
    const userRoutes = new UserRoutes(userService);

    // Register routes
    operationRoutes.register(server);
    roleRoutes.register(server);
    userRoutes.register(server);
};
