import { CreateUserData, UpdateUserData, UserRepository } from "../infraestructure/userRepository";
import { User } from "../domains/users";

/**
 * Service layer for user use cases.
 *
 * This service depends on UserRepository and does not know which ORM or database driver is used.
 *
 * @public
 */
export class UserService {
    /**
     * Creates the user service.
     *
     * @param userRepository - Repository used to access user data.
     */
    public constructor(private readonly userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    /** Gets one user by its identifier. */
    public getById(id: string): Promise<User | null> {
        return this.userRepository.getById(id);
    }

    /** Gets all users. */
    public getAll(): Promise<User[]> {
        return this.userRepository.getAll();
    }

    /** Creates one user. */
    public create(data: CreateUserData): Promise<User> {
        return this.userRepository.create(data);
    }

    /** Updates one user by its identifier. */
    public update(id: string, data: UpdateUserData): Promise<User> {
        return this.userRepository.update(id, data);
    }

    /** Deletes one user by its identifier. */
    public delete(id: string): Promise<void> {
        return this.userRepository.delete(id);
    }
}
