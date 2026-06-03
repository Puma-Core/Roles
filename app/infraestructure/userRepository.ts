import { BaseRepository, RepositoryConstructor } from "./baseRepository";
import { User } from "../domains/users";
import { CreateUserValues } from "../domains/interfaces/users";

/** Data required to create a user. */
export type CreateUserData = CreateUserValues;

/** Data allowed to update a user. */
export type UpdateUserData = Partial<CreateUserValues>;

/**
 * User repository bound to the user domain model.
 *
 * The concrete storage implementation is provided through the constructor, so this repository
 * does not need to know which ORM or database driver is being used.
 *
 * @public
 */
export class UserRepository extends BaseRepository<User, CreateUserData, UpdateUserData, number> {
    /** Prisma model name used by the concrete repository implementation. */
    public static readonly TABLE_NAME = "User";
    public static readonly MODEL = User;
    private readonly prisma: {
        User: {
            findUnique(args: { where: { id: number }; include: typeof USER_RELATIONS_INCLUDE }): Promise<User | null>;
            findMany(args: { include: typeof USER_ROLES_INCLUDE }): Promise<User[]>;
        };
    };

    /**
     * Creates a user repository using the provided repository implementation.
     *
     * @param repositoryClass - Repository implementation class to instantiate.
     * @param args - Arguments passed to the repository implementation constructor.
     */
    public constructor(
        repositoryClass: RepositoryConstructor<User, CreateUserData, UpdateUserData, number>,
        ...args: unknown[]
    ) {
        super(repositoryClass, UserRepository.TABLE_NAME, UserRepository.MODEL, ...args);
        this.prisma = args[0] as typeof this.prisma;
    }

    /** Gets one user by its identifier with assigned roles. */
    public async getByIdWithRoles(id: number): Promise<User | null> {
        const user = await this.prisma.User.findUnique({
            where: { id },
            include: USER_RELATIONS_INCLUDE,
        });

        return user ? new User(user) : null;
    }

    /** Gets all users with assigned roles. */
    public async getAllWithRoles(): Promise<User[]> {
        const users = await this.prisma.User.findMany({
            include: USER_ROLES_INCLUDE,
        });

        return users.map((user) => new User(user));
    }
}

const USER_ROLES_INCLUDE = {
    roles: true,
} as const;

const USER_RELATIONS_INCLUDE = {
    roles: {
        include: {
            rolePermissions: {
                include: {
                    permission: {
                        include: {
                            operations: true,
                        },
                    },
                },
            },
        },
    },
} as const;
