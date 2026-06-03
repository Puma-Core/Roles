import "@fastify/jwt";
import { FastifyInstance } from "fastify";
import { LoginUserValues } from "../domains/interfaces/users";
import { Token } from "../domains/tokens";
import { User } from "../domains/users";
import { TokenRepository } from "../infraestructure/tokenRepository";
import { UserRepository } from "../infraestructure/userRepository";

const JWT_EXPIRES_IN_MIN = Number(process.env.JWT_EXPIRES_IN_MIN ?? 60);

const MINUTE_IN_MS = 60 * 1000;

type TokenPayload = Record<string, unknown>;

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
        private readonly userRepository: UserRepository,
        private readonly server: FastifyInstance,
    ) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.server = server;
    }

    /** Authenticates one user and creates an access token. */
    public async login(data: LoginUserValues): Promise<Token | null> {
        const user = await this.userRepository.getBy({ username: data.username });

        if (!user) {
            return null;
        }

        const passwordMatches = await user.isValidPassword(data.password);

        if (!passwordMatches) {
            return null;
        }

        return await this.create(user);
    }

    /** Creates an access token associated with one user and returns the created token. */
    public create(user: User): Promise<Token> {
        return this.tokenRepository.create(this.createTokenData(user));
    }

    /** Validates an existing token and refreshes it while it is still valid. */
    public accessToken(token: Token, user: User): Promise<Token> {
        if (token.expireAt.getTime() <= Date.now()) {
            throw new Error("Not Authorized");
        }

        return this.tokenRepository.update(token.id, this.createTokenData(user));
    }

    /** Refreshes a bearer token while the persisted token is still valid. */
    public async refresh_token(bearerToken: string): Promise<Token> {
        const value = this.getBearerValue(bearerToken);
        const token = await this.tokenRepository.getBy({ value });

        if (!token || token.expireAt.getTime() <= Date.now()) {
            throw new Error("Not Authorized");
        }

        const payload = this.server.jwt.decode<TokenPayload>(token.value);

        if (!payload) {
            throw new Error("Not Authorized");
        }

        return await this.tokenRepository.update(token.id, this.createTokenDataFromPayload(payload, token.userId));
    }

    private createTokenData(user: User) {
        const { password, tokens, id, createdAt, updatedAt, roles, ...data } = user;

        return this.createTokenDataFromPayload(
            {
                ...data,
                userId: user.id,
            },
            user.id,
        );
    }

    private createTokenDataFromPayload(payload: TokenPayload, userId: number) {
        const { exp, iat, nbf, ...data } = payload;
        const expiresIn = JWT_EXPIRES_IN_MIN * 60;
        const expireAt = new Date(Date.now() + JWT_EXPIRES_IN_MIN * MINUTE_IN_MS);

        const value = this.server.jwt.sign(
            data,
            {
                expiresIn,
            },
        );

        return {
            name: "access_token",
            value,
            expireAt,
            userId,
        };
    }

    private getBearerValue(bearerToken: string): string {
        const [schema, value] = bearerToken.trim().split(/\s+/);

        if (schema !== "Bearer" || !value) {
            throw new Error("Not Authorized");
        }

        return value;
    }
}
