import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateRoleData, UpdateRoleData } from "../infraestructure/roleRepository";
import { RoleService } from "../services/roleService";

type RoleParams = {
    id: string;
};

/** Registers role HTTP routes. */
export class RoleRoutes {
    public constructor(private readonly roleService: RoleService) {
        this.roleService = roleService;
    }

    public register(server: FastifyInstance): void {
        server.get("/api/roles", this.getAll.bind(this));
        server.get("/api/roles/:id", this.getById.bind(this));
        server.post("/api/roles", this.create.bind(this));
        server.put("/api/roles/:id", this.update.bind(this));
        server.delete("/api/roles/:id", this.delete.bind(this));
    }

    private async getAll(): Promise<unknown> {
        return await this.roleService.getAll();
    }

    private async getById(
        request: FastifyRequest<{ Params: RoleParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const role = await this.roleService.getById(request.params.id);

        if (role === null) {
            return reply.status(404).send({ message: "Role not found" });
        }

        return role;
    }

    private async create(
        request: FastifyRequest<{ Body: CreateRoleData }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const role = await this.roleService.create(request.body);

        return reply.status(201).send(role);
    }

    private async update(
        request: FastifyRequest<{ Params: RoleParams; Body: UpdateRoleData }>,
    ): Promise<unknown> {
        return await this.roleService.update(request.params.id, request.body);
    }

    private async delete(
        request: FastifyRequest<{ Params: RoleParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        await this.roleService.delete(request.params.id);

        return reply.status(204).send();
    }
}
