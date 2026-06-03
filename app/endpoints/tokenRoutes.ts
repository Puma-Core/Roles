import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TokenService } from "../services/tokenService";
import { tokenSchemas, errorSchema } from "./schemas";

/** Registers token HTTP routes. */
export class TokenRoutes {
    private readonly ROUTE_PREFIX = "/api/tokens";

    public constructor(private readonly tokenService: TokenService) {
        this.tokenService = tokenService;
    }

    public register(server: FastifyInstance): void {
        server.post(`${this.ROUTE_PREFIX}/login`, {
            schema: {
                tags: ["Tokens"],
                summary: "Login with credentials",
                description: "Authenticates a user and returns an access token.",
                body: tokenSchemas.LoginRequest,
                response: {
                    200: tokenSchemas.Token,
                    401: errorSchema,
                },
            },
        }, this.login.bind(this));

        server.post(`${this.ROUTE_PREFIX}/refresh`, {
            schema: {
                tags: ["Tokens"],
                summary: "Refresh access token",
                description: "Refreshes a valid token while it has not expired.",
                headers: {
                    type: "object",
                    required: ["authorization"],
                    properties: {
                        authorization: { type: "string" },
                    },
                },
                response: {
                    200: tokenSchemas.Token,
                    401: errorSchema,
                },
            },
        }, this.refreshToken.bind(this));
    }

    private async login(
        request: FastifyRequest<{ Body: { username: string; password: string } }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const { username, password } = request.body;
        const token = await this.tokenService.login({ username, password });

        if (token === null) {
            return reply.status(401).send({ message: "Invalid credentials" });
        }

        return token;
    }

    private async refreshToken(request: FastifyRequest, reply: FastifyReply): Promise<unknown> {
        const authorization = request.headers.authorization;

        if (!authorization) {
            return reply.status(401).send({ message: "Not Authorized" });
        }

        try {
            return await this.tokenService.refresh_token(authorization);
        } catch (error) {
            if (error instanceof Error && error.message === "Not Authorized") {
                return reply.status(401).send({ message: error.message });
            }

            throw error;
        }
    }
}
