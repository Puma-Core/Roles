import { BaseRepository, RepositoryConstructor } from "./baseRepository";
import { User } from "../domains/users";
import { UserValues } from "../domains/interfaces/users";

/** Data required to create a user. */
export type CreateUserData = UserValues;

/** Data allowed to update a user. */
export type UpdateUserData = Partial<UserValues>;

/**
 * User repository bound to the user domain model.
 *
 * The concrete storage implementation is provided through the constructor, so this repository
 * does not need to know which ORM or database driver is being used.
 *
 * @public
 */
export class UserRepository extends BaseRepository<User, CreateUserData, UpdateUserData, string> {
    /** Prisma model name used by the concrete repository implementation. */
    public static readonly TABLE_NAME = "User";

    /**
     * Creates a user repository using the provided repository implementation.
     *
     * @param repositoryClass - Repository implementation class to instantiate.
     * @param args - Arguments passed to the repository implementation constructor.
     */
    public constructor(
        repositoryClass: RepositoryConstructor<User, CreateUserData, UpdateUserData, string>,
        ...args: unknown[]
    ) {
        super(repositoryClass, UserRepository.TABLE_NAME, ...args);
    }
}
