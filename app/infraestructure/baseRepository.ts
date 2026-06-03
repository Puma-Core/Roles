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

/** Defines the constructor shape required to create a domain entity instance. */
export type EntityConstructor<Entity> = new (values: Entity) => Entity;

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
     * @param entityClass - Domain entity class used to create returned model instances.
     * @param args - Arguments passed to the repository implementation constructor.
     */
    public constructor(
        repositoryClass: RepositoryConstructor<Entity, CreateData, UpdateData, Id, Args>,
        nameTable: string,
        private readonly entityClass: EntityConstructor<Entity>,
        ...args: Args
    ) {
        this.repository = new repositoryClass(nameTable, ...args);
    }

    private toEntity(data: Entity): Entity {
        return data instanceof this.entityClass ? data : new this.entityClass(data);
    }

    /** Gets one entity by its identifier. */
    public async getById(id: Id): Promise<Entity | null> {
        const entity = await this.repository.getById(id);

        return entity ? this.toEntity(entity) : null;
    }

    /** Gets the first entity that matches a specific criteria. */
    public async getBy(where: Partial<Record<keyof Entity, unknown>>): Promise<Entity | null> {
        const entity = await this.repository.getBy(where);

        return entity ? this.toEntity(entity) : null;
    }

    /** Gets all entities. */
    public async getAll(): Promise<Entity[]> {
        const entities = await this.repository.getAll();

        return entities.map((entity) => this.toEntity(entity));
    }

    /** Creates one entity. */
    public async create(data: CreateData): Promise<Entity> {
        const entity = await this.repository.create(data);

        return this.toEntity(entity);
    }

    /** Updates one entity by its identifier. */
    public async update(id: Id, data: UpdateData): Promise<Entity> {
        const entity = await this.repository.update(id, data);

        return this.toEntity(entity);
    }

    /** Deletes one entity by its identifier. */
    public async delete(id: Id): Promise<void> {
        await this.repository.delete(id);
    }
}
