import bcrypt from "bcrypt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UpdateUserData } from "../infraestructure/userRepository";
import { UserService } from "../services/userService";
import { UserCreatePayload } from "./models/userCreatePayload";

type UserParams = {
    id: string;
};


/** Registers user HTTP routes. */
export class UserRoutes {
    public constructor(private readonly userService: UserService) {
        this.userService = userService;
    }

    public register(server: FastifyInstance): void {
        server.get("/api/users", this.getAll.bind(this));
        server.get("/api/users/:id", this.getById.bind(this));
        server.post("/api/users", this.create.bind(this));
        server.put("/api/users/:id", this.update.bind(this));
        server.delete("/api/users/:id", this.delete.bind(this));
    }

    private async getAll(): Promise<unknown> {
        return await this.userService.getAll();
    }

    private async getById(
        request: FastifyRequest<{ Params: UserParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const user = await this.userService.getById(request.params.id);

        if (user === null) {
            return reply.status(404).send({ message: "User not found" });
        }

        return user;
    }

    private async create(
        request: FastifyRequest<{ Body: UserCreatePayload }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const user = await this.userService.create(request.body);

        return reply.status(201).send(user);
    }

    private async update(
        request: FastifyRequest<{ Params: UserParams; Body: UpdateUserData }>,
    ): Promise<unknown> {
        return await this.userService.update(request.params.id, request.body);
    }

    private async delete(
        request: FastifyRequest<{ Params: UserParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        await this.userService.delete(request.params.id);

        return reply.status(204).send();
    }
}
