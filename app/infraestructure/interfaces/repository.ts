/**
 * Defines the generic CRUD operations required by a repository.
 *
 * @typeParam Entity - Entity returned by read operations.
 * @typeParam CreateData - Data required to create an entity.
 * @typeParam UpdateData - Data required to update an entity.
 * @typeParam Id - Identifier type used to find, update, or delete an entity.
 *
 * @public
 */
export type RepositoryQueryArgs = Record<string, unknown>;

export interface Repository<Entity, CreateData = Entity, UpdateData = Partial<Entity>, Id = string> {
    /** Gets one entity by its identifier. */
    getById(id: Id, args?: RepositoryQueryArgs): Promise<Entity | null>;

    /** Gets the first entity that matches a specific criteria. */
    getBy(where: Partial<Record<keyof Entity, unknown>>, args?: RepositoryQueryArgs): Promise<Entity | null>;

    /** Gets all entities. */
    getAll(args?: RepositoryQueryArgs): Promise<Entity[]>;

    /** Creates one entity. */
    create(data: CreateData): Promise<Entity>;

    /** Updates one entity by its identifier. */
    update(id: Id, data: UpdateData, args?: RepositoryQueryArgs): Promise<Entity>;

    /** Deletes one entity by its identifier. */
    delete(id: Id): Promise<void>;
}
