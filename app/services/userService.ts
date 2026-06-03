import bcrypt from "bcrypt";
import { CreateUserData, UpdateUserData, UserRepository } from "../infraestructure/userRepository";
import { User } from "../domains/users";

const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS ? Number(process.env.BCRYPT_SALT_ROUNDS) : 10;
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
    public async getById(id: string): Promise<User | null> {
        return await this.userRepository.getById(id);
    }

    /** Gets all users. */
    public async getAll(): Promise<User[]> {
        return await this.userRepository.getAll();
    }

    /** Creates one user. */
    public async create(data: CreateUserData): Promise<User> {
        const password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
        return this.userRepository.create({ ...data, password });
    }

    /** Updates one user by its identifier. */
    public async update(id: string, data: UpdateUserData): Promise<User> {
        return await this.userRepository.update(id, data);
    }

    /** Deletes one user by its identifier. */
    public async delete(id: string): Promise<void> {
        return this.userRepository.delete(id);
    }
}
