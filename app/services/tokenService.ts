import "@fastify/jwt";
import { FastifyInstance } from "fastify";
import { Token } from "../domains/tokens";
import { User } from "../domains/users";
import { TokenRepository } from "../infraestructure/tokenRepository";

const JWT_EXPIRES_IN_MIN = Number(process.env.JWT_EXPIRES_IN_MIN ?? 60);

const MINUTE_IN_MS = 60 * 1000;

/**
 * Service layer for token use cases.
 *
 * This service depends on TokenRepository and does not know which ORM or database driver is used.
 *
 * @public
 */
export class TokenService {
    /**
     * Creates the token service.
     *
     * @param tokenRepository - Repository used to access token data.
     */
    public constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly server: FastifyInstance,
    ) {
        this.tokenRepository = tokenRepository;
        this.server = server;
    }

    /** Creates an access token associated with one user and returns the created token. */
    public getToken(user: User): Promise<Token> {
        const { password, tokens, id, ...data } = user;
        const expiresIn = JWT_EXPIRES_IN_MIN * 60;
        const expireAt = new Date(Date.now() + JWT_EXPIRES_IN_MIN * MINUTE_IN_MS);

        const value = this.server.jwt.sign(
            {
                ...data,
            },
            {
                expiresIn,
            },
        );

        return this.tokenRepository.create({
            name: "access_token",
            value,
            expireAt,
            userId: user.id,
        });
    }
}
