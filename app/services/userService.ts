import bcrypt from "bcrypt";
import { LoginUserValues } from "../domains/interfaces/users";
import { Token } from "../domains/tokens";
import { CreateUserData, UpdateUserData, UserRepository } from "../infraestructure/userRepository";
import { User } from "../domains/users";
import { TokenService } from "./tokenService";

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
    public constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
    ) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    /** Gets one user by its identifier. */
    public async getById(id: number): Promise<User | null> {
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

    /** Authenticates one user by username and password. */
    public async login(data: LoginUserValues): Promise<Token | null> {
        const users = await this.userRepository.getAll();
        const user = users.find((currentUser) => currentUser.username === data.username);

        if (!user) {
            return null;
        }

        const passwordMatches = await user.isValidPassword(data.password);

        if (!passwordMatches) {
            return null;
        }

        return await this.tokenService.getToken(user);
    }

    /** Updates one user by its identifier. */
    public async update(id: number, data: UpdateUserData): Promise<User> {
        return await this.userRepository.update(id, data);
    }

    /** Deletes one user by its identifier. */
    public async delete(id: number): Promise<void> {
        return this.userRepository.delete(id);
    }
}
