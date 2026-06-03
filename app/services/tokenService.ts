import jwt, { Algorithm } from "jsonwebtoken";
import { Token } from "../domains/tokens";
import { User } from "../domains/users";
import { TokenRepository } from "../infraestructure/tokenRepository";

const JWT_SECRET = process.env.JWT_SECRET ?? "development-secret";
const JWT_EXPIRES_IN_MIN = Number(process.env.JWT_EXPIRES_IN_MIN ?? 60);
const JWT_ALGORITHM = (process.env.JWT_ALGORITHM ?? "HS256") as Algorithm;

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
    public constructor(private readonly tokenRepository: TokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    /** Creates an access token associated with one user and returns the created token. */
    public getToken(user: User): Promise<Token> {
        const { password, tokens, id, ...data } = user;
        const expiresIn = JWT_EXPIRES_IN_MIN * MINUTE_IN_MS;
        const expireAt = new Date(Date.now() + expiresIn);

        const value = jwt.sign(
            data,
            JWT_SECRET,
            {
                algorithm: JWT_ALGORITHM,
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
