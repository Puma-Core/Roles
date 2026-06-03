import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreatePermissionData, UpdatePermissionData } from "../infraestructure/permissionRepository";
import { PERMISSION_OPERATIONS_INCLUDE } from "../integrations/prisma/includes/permissionIncludes";
import { PermissionService } from "../services/permissionService";
import { errorSchema, permissionSchemas } from "./schemas";

type PermissionParams = {
    id: string;
};

const idParamSchema = {
    type: "object",
    required: ["id"],
    properties: { id: { type: "string" } },
};

/** Registers permission HTTP routes. */
export class PermissionRoutes {
    private readonly BASE_PATH = "/api/permissions";

    public constructor(private readonly permissionService: PermissionService) {
        this.permissionService = permissionService;
    }

    public register(server: FastifyInstance): void {
        server.get(this.BASE_PATH, {
            schema: {
                tags: ["Permissions"],
                summary: "Get all permissions",
                description: "Returns a list of all registered permissions with their operations.",
                response: {
                    200: { type: "array", items: permissionSchemas.Permission },
                },
            },
        }, this.getAll.bind(this));

        server.get(`${this.BASE_PATH}/:id`, {
            schema: {
                tags: ["Permissions"],
                summary: "Get permission by ID",
                description: "Returns a single permission by its identifier with its operations.",
                params: idParamSchema,
                response: {
                    200: permissionSchemas.Permission,
                    404: errorSchema,
                },
            },
        }, this.getById.bind(this));

        server.post(this.BASE_PATH, {
            schema: {
                tags: ["Permissions"],
                summary: "Create a new permission",
                description: "Creates a new permission with the provided data.",
                body: permissionSchemas.CreatePermission,
                response: {
                    201: permissionSchemas.Permission,
                },
            },
        }, this.create.bind(this));

        server.patch(`${this.BASE_PATH}/:id`, {
            schema: {
                tags: ["Permissions"],
                summary: "Update a permission",
                description: "Updates an existing permission and can replace its operation IDs.",
                params: idParamSchema,
                body: permissionSchemas.UpdatePermission,
                response: {
                    200: permissionSchemas.Permission,
                },
            },
        }, this.update.bind(this));

        server.delete(`${this.BASE_PATH}/:id`, {
            schema: {
                tags: ["Permissions"],
                summary: "Delete a permission",
                description: "Deletes a permission by its identifier.",
                params: idParamSchema,
                response: {
                    204: { description: "Permission deleted" },
                },
            },
        }, this.delete.bind(this));
    }

    private async getAll(): Promise<unknown> {
        return await this.permissionService.getAll({ include: PERMISSION_OPERATIONS_INCLUDE });
    }

    private async getById(
        request: FastifyRequest<{ Params: PermissionParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const permission = await this.permissionService.getById(Number(request.params.id), {
            include: PERMISSION_OPERATIONS_INCLUDE,
        });

        if (permission === null) {
            return reply.status(404).send({ message: "Permission not found" });
        }

        return permission;
    }

    private async create(
        request: FastifyRequest<{ Body: CreatePermissionData }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const { name, scope } = request.body;
        const permission = await this.permissionService.create({ name, scope });

        return reply.status(201).send(permission);
    }

    private async update(
        request: FastifyRequest<{ Params: PermissionParams; Body: UpdatePermissionData }>,
    ): Promise<unknown> {
        return await this.permissionService.update(Number(request.params.id), request.body, {
            include: PERMISSION_OPERATIONS_INCLUDE,
        });
    }

    private async delete(
        request: FastifyRequest<{ Params: PermissionParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        await this.permissionService.delete(Number(request.params.id));

        return reply.status(204).send();
    }
}
