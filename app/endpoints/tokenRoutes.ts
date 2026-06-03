import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TokenService } from "../services/tokenService";

/** Registers token HTTP routes. */
export class TokenRoutes {
    private readonly ROUTE_PREFIX = "/api/tokens";

    public constructor(private readonly tokenService: TokenService) {
        this.tokenService = tokenService;
    }

    public register(server: FastifyInstance): void {
        server.post(`${this.ROUTE_PREFIX}/login`, this.login.bind(this));
        server.post(`${this.ROUTE_PREFIX}/refresh`, this.refreshToken.bind(this));
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
