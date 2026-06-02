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
export type RepositoryConstructor<Entity, CreateData = Entity, UpdateData = Partial<Entity>, Id = string> =
    new (...args: unknown[]) => Repository<Entity, CreateData, UpdateData, Id>;

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
export class BaseRepository<Entity, CreateData = Entity, UpdateData = Partial<Entity>, Id = string>
    implements Repository<Entity, CreateData, UpdateData, Id>
{
    private readonly repository: Repository<Entity, CreateData, UpdateData, Id>;

    /**
     * Creates the base repository using a concrete repository class and its constructor arguments.
     *
     * @param repositoryClass - Repository implementation class to instantiate.
     * @param args - Arguments passed to the repository implementation constructor.
     */
    public constructor(
        repositoryClass: RepositoryConstructor<Entity, CreateData, UpdateData, Id>,
        ...args: unknown[]
    ) {
        this.repository = new repositoryClass(...args);
    }

    /** Gets one entity by its identifier. */
    public getById(id: Id): Promise<Entity | null> {
        return this.repository.getById(id);
    }

    /** Gets all entities. */
    public getAll(): Promise<Entity[]> {
        return this.repository.getAll();
    }

    /** Creates one entity. */
    public create(data: CreateData): Promise<Entity> {
        return this.repository.create(data);
    }

    /** Updates one entity by its identifier. */
    public update(id: Id, data: UpdateData): Promise<Entity> {
        return this.repository.update(id, data);
    }

    /** Deletes one entity by its identifier. */
    public delete(id: Id): Promise<void> {
        return this.repository.delete(id);
    }
}
