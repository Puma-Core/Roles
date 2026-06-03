import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { OperationRepository } from "../infraestructure/operationRepository";
import { PermissionRepository } from "../infraestructure/permissionRepository";
import { PrismaRepository } from "../infraestructure/prisma/prismaRepository";
import { RoleRepository } from "../infraestructure/roleRepository";
import { TokenRepository } from "../infraestructure/tokenRepository";
import { UserRepository } from "../infraestructure/userRepository";
import { OperationService } from "../services/operationService";
import { PermissionService } from "../services/permissionService";
import { RoleService } from "../services/roleService";
import { TokenService } from "../services/tokenService";
import { UserService } from "../services/userService";
import { OperationRoutes } from "./operationRoutes";
import { PermissionRoutes } from "./permissionRoutes";
import { RoleRoutes } from "./roleRoutes";
import { TokenRoutes } from "./tokenRoutes";
import { UserRoutes } from "./userRoutes";

export const routes: FastifyPluginAsync = async (server) => {
    const prisma = server.prisma;

    const operationRepository = new OperationRepository(PrismaRepository, prisma);
    const permissionRepository = new PermissionRepository(PrismaRepository, prisma);
    const roleRepository = new RoleRepository(PrismaRepository, prisma);
    const tokenRepository = new TokenRepository(PrismaRepository, prisma);
    const userRepository = new UserRepository(PrismaRepository, prisma);

    // Add Service Instances
    const operationService = new OperationService(operationRepository);
    const permissionService = new PermissionService(permissionRepository);
    const roleService = new RoleService(roleRepository);
    const tokenService = new TokenService(tokenRepository, userRepository, server);
    const userService = new UserService(userRepository);

    // Add authenticate decorator
    server.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch {
            return reply.status(401).send({ message: "Not Authorized" });
        }
    });

    // Add Routes
    const operationRoutes = new OperationRoutes(operationService);
    const permissionRoutes = new PermissionRoutes(permissionService);
    const roleRoutes = new RoleRoutes(roleService);
    const tokenRoutes = new TokenRoutes(tokenService);
    const userRoutes = new UserRoutes(userService);

    // Register routes
    operationRoutes.register(server);
    permissionRoutes.register(server);
    roleRoutes.register(server);
    tokenRoutes.register(server);
    userRoutes.register(server);
};
