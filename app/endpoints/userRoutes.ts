import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UpdateUserData } from "../infraestructure/userRepository";
import { UserService } from "../services/userService";
import { UserCreatePayload } from "./models/userCreatePayload";
import { userSchemas, errorSchema } from "./schemas";

type UserParams = {
    id: string;
};

const idParamSchema = {
    type: "object",
    required: ["id"],
    properties: { id: { type: "string" } },
};

/** Registers user HTTP routes. */
export class UserRoutes {
    ROUTE_PREFIX = "/api/users";

    public constructor(private readonly userService: UserService) {
        this.userService = userService;
    }

    public register(server: FastifyInstance): void {
        server.get(`${this.ROUTE_PREFIX}/me`, {
            onRequest: [server.authenticate],
            schema: {
                tags: ["Users"],
                summary: "Get current user",
                description: "Returns the authenticated user's information based on the JWT token.",
                security: [{ BearerAuth: [] }],
                response: {
                    200: userSchemas.User,
                    401: errorSchema,
                },
            },
        }, this.getMe.bind(this));

        server.get(`${this.ROUTE_PREFIX}`, {
            schema: {
                tags: ["Users"],
                summary: "Get all users",
                description: "Returns a list of all registered users.",
                response: {
                    200: { type: "array", items: userSchemas.User },
                },
            },
        }, this.getAll.bind(this));

        server.get(`${this.ROUTE_PREFIX}/:id`, {
            schema: {
                tags: ["Users"],
                summary: "Get user by ID",
                description: "Returns a single user by its identifier.",
                params: idParamSchema,
                response: {
                    200: userSchemas.User,
                    404: errorSchema,
                },
            },
        }, this.getById.bind(this));

        server.post(`${this.ROUTE_PREFIX}`, {
            schema: {
                tags: ["Users"],
                summary: "Create a new user",
                description: "Creates a new user with the provided data.",
                body: userSchemas.CreateUser,
                response: {
                    201: userSchemas.User,
                },
            },
        }, this.create.bind(this));

        server.put(`${this.ROUTE_PREFIX}/:id`, {
            schema: {
                tags: ["Users"],
                summary: "Update a user",
                description: "Updates an existing user by its identifier.",
                params: idParamSchema,
                body: userSchemas.UpdateUser,
                response: {
                    200: userSchemas.User,
                },
            },
        }, this.update.bind(this));

        server.delete(`${this.ROUTE_PREFIX}/:id`, {
            schema: {
                tags: ["Users"],
                summary: "Delete a user",
                description: "Deletes a user by its identifier.",
                params: idParamSchema,
                response: {
                    204: { description: "User deleted" },
                },
            },
        }, this.delete.bind(this));
    }

    private async getMe(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<unknown> {
        const user = await this.userService.getCurrentUser(request.user as Record<string, unknown>);

        if (user === null) {
            return reply.status(404).send({ message: "User not found" });
        }

        return user;
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

}
