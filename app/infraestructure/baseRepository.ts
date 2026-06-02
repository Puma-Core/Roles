import { Repository } from "./interfaces/repository";

/**
 * Defines the constructor shape required to create a repository implementation.
 *
 * @typeParam Entity - Entity returned by read operations.
 * @typeParam CreateData - Data required to create an entity.
 * @typeParam UpdateData - Data required to update an entity.
 * @typeParam Id - Identifier type used to find, update, or delete an entity.
 *
 * @public
 */
export type RepositoryConstructor<
    Entity,
    CreateData = Entity,
    UpdateData = Partial<Entity>,
    Id = string,
    Args extends unknown[] = any[],
> = new (nameTable: string, ...args: Args) => Repository<Entity, CreateData, UpdateData, Id>;

/**
 * Base repository that delegates CRUD operations to a concrete repository implementation.
 *
 * @typeParam Entity - Entity returned by read operations.
 * @typeParam CreateData - Data required to create an entity.
 * @typeParam UpdateData - Data required to update an entity.
 * @typeParam Id - Identifier type used to find, update, or delete an entity.
 *
 * @public
 */
export class BaseRepository<
    Entity,
    CreateData = Entity,
    UpdateData = Partial<Entity>,
    Id = string,
    Args extends unknown[] = any[],
>
    implements Repository<Entity, CreateData, UpdateData, Id>
{
    private readonly repository: Repository<Entity, CreateData, UpdateData, Id>;

    /**
     * Creates the base repository using a concrete repository class and its constructor arguments.
     *
     * @param repositoryClass - Repository implementation class to instantiate.
     * @param nameTable - Table or model name used by the concrete repository implementation.
     * @param args - Arguments passed to the repository implementation constructor.
     */
    public constructor(
        repositoryClass: RepositoryConstructor<Entity, CreateData, UpdateData, Id, Args>,
        nameTable: string,
        ...args: Args
    ) {
        this.repository = new repositoryClass(nameTable, ...args);
    }

    /** Gets one entity by its identifier. */
    public async getById(id: Id): Promise<Entity | null> {
        return await this.repository.getById(id);
    }

    /** Gets all entities. */
    public async getAll(): Promise<Entity[]> {
        return await this.repository.getAll();
    }

    /** Creates one entity. */
    public async create(data: CreateData): Promise<Entity> {
        return await this.repository.create(data);
    }

    /** Updates one entity by its identifier. */
    public async update(id: Id, data: UpdateData): Promise<Entity> {
        return await this.repository.update(id, data);
    }

    /** Deletes one entity by its identifier. */
    public async delete(id: Id): Promise<void> {
        await this.repository.delete(id);
    }
}
