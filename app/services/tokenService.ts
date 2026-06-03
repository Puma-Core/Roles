import jwt from "jsonwebtoken";
import { Token } from "../domains/tokens";
import { User } from "../domains/users";
import { TokenRepository } from "../infraestructure/tokenRepository";

const JWT_SECRET = process.env.JWT_SECRET ?? "development-secret";

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
        const { password, tokens, ...data } = user;
        const value = jwt.sign(
            {
                ...data,
                userId: user.id,
            },
            JWT_SECRET,
        );

        return this.tokenRepository.create({
            name: "access_token",
            value,
            userId: user.id,
        });
    }
}
