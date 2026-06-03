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
        server.post("/api/users/login", this.login.bind(this));
    }

    private async getAll(): Promise<unknown> {
        return await this.userService.getAll();
    }

    private async getById(
        request: FastifyRequest<{ Params: UserParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const user = await this.userService.getById(Number(request.params.id));

        if (user === null) {
            return reply.status(404).send({ message: "User not found" });
        }

        return user;
    }

    private async create(
        request: FastifyRequest<{ Body: UserCreatePayload }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const { age, firstName, lastName, nationality, password, roles, username } = request.body;
        const user = await this.userService.create({ age, firstName, lastName, nationality, password, roles, username });

        return reply.status(201).send(user);
    }

    private async update(
        request: FastifyRequest<{ Params: UserParams; Body: UpdateUserData }>,
    ): Promise<unknown> {
        return await this.userService.update(Number(request.params.id), request.body);
    }

    private async delete(
        request: FastifyRequest<{ Params: UserParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        await this.userService.delete(Number(request.params.id));

        return reply.status(204).send();
    }

    private async login(
        request: FastifyRequest<{ Body: { username: string; password: string } }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const { username, password } = request.body;
        const token = await this.userService.login({ username, password });

        if (token === null) {
            return reply.status(401).send({ message: "Invalid credentials" });
        }

        return token;
    }
}
