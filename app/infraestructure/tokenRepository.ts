import { Token } from "../domains/tokens";
import { CreateTokenValues } from "../domains/interfaces/tokens";
import { BaseRepository, RepositoryConstructor } from "./baseRepository";

/** Data required to create a token. */
export type CreateTokenData = CreateTokenValues;

/** Data allowed to update a token. */
export type UpdateTokenData = Partial<CreateTokenValues>;

/**
 * Token repository bound to the token domain model.
 *
 * The concrete storage implementation is provided through the constructor, so this repository
 * does not need to know which ORM or database driver is being used.
 *
 * @public
 */
export class TokenRepository extends BaseRepository<Token, CreateTokenData, UpdateTokenData, number> {
    /** Prisma model name used by the concrete repository implementation. */
    public static readonly TABLE_NAME = "Token";

    /**
     * Creates a token repository using the provided repository implementation.
     *
     * @param repositoryClass - Repository implementation class to instantiate.
     * @param args - Arguments passed to the repository implementation constructor.
     */
    public constructor(
        repositoryClass: RepositoryConstructor<Token, CreateTokenData, UpdateTokenData, number>,
        ...args: unknown[]
    ) {
        super(repositoryClass, TokenRepository.TABLE_NAME, ...args);
    }
}
