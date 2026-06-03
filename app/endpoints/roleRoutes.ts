import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateRoleData, UpdateRoleData } from "../infraestructure/roleRepository";
import { RoleService } from "../services/roleService";
import { roleSchemas, errorSchema } from "./schemas";

type RoleParams = {
    id: string;
};

const idParamSchema = {
    type: "object",
    required: ["id"],
    properties: { id: { type: "string" } },
};

/** Registers role HTTP routes. */
export class RoleRoutes {
    public constructor(private readonly roleService: RoleService) {
        this.roleService = roleService;
    }

    public register(server: FastifyInstance): void {
        server.get("/api/roles", {
            schema: {
                tags: ["Roles"],
                summary: "Get all roles",
                description: "Returns a list of all registered roles.",
                response: {
                    200: { type: "array", items: roleSchemas.Role },
                },
            },
        }, this.getAll.bind(this));

        server.get("/api/roles/:id", {
            schema: {
                tags: ["Roles"],
                summary: "Get role by ID",
                description: "Returns a single role by its identifier.",
                params: idParamSchema,
                response: {
                    200: roleSchemas.Role,
                    404: errorSchema,
                },
            },
        }, this.getById.bind(this));

        server.post("/api/roles", {
            schema: {
                tags: ["Roles"],
                summary: "Create a new role",
                description: "Creates a new role with the provided data.",
                body: roleSchemas.CreateRole,
                response: {
                    201: roleSchemas.Role,
                },
            },
        }, this.create.bind(this));

        server.put("/api/roles/:id", {
            schema: {
                tags: ["Roles"],
                summary: "Update a role",
                description: "Updates an existing role by its identifier.",
                params: idParamSchema,
                body: roleSchemas.UpdateRole,
                response: {
                    200: roleSchemas.Role,
                },
            },
        }, this.update.bind(this));

        server.delete("/api/roles/:id", {
            schema: {
                tags: ["Roles"],
                summary: "Delete a role",
                description: "Deletes a role by its identifier.",
                params: idParamSchema,
                response: {
                    204: { description: "Role deleted" },
                },
            },
        }, this.delete.bind(this));
    }

    private async getAll(): Promise<unknown> {
        return await this.roleService.getAll();
    }

    private async getById(
        request: FastifyRequest<{ Params: RoleParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const role = await this.roleService.getById(Number(request.params.id));

        if (role === null) {
            return reply.status(404).send({ message: "Role not found" });
        }

        return role;
    }

    private async create(
        request: FastifyRequest<{ Body: CreateRoleData }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const { name, scope } = request.body;
        const role = await this.roleService.create({ name, scope });

        return reply.status(201).send(role);
    }

    private async update(
        request: FastifyRequest<{ Params: RoleParams; Body: UpdateRoleData }>,
    ): Promise<unknown> {
        return await this.roleService.update(Number(request.params.id), request.body);
    }

    private async delete(
        request: FastifyRequest<{ Params: RoleParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        await this.roleService.delete(Number(request.params.id));

        return reply.status(204).send();
    }
}
