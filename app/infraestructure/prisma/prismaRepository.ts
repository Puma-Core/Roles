import { Repository } from "../interfaces/repository";

/**
 * Defines the minimum Prisma model operations required by the generic Prisma repository.
 *
 * @typeParam Entity - Entity returned by read operations.
 * @typeParam CreateData - Data required to create an entity.
 * @typeParam UpdateData - Data required to update an entity.
 * @typeParam Id - Identifier type used to find, update, or delete an entity.
 *
 * @public
 */
export type PrismaModel<Entity, CreateData, UpdateData, Id> = {
    findUnique(args: { where: { id: Id } }): Promise<Entity | null>;
    findMany(): Promise<Entity[]>;
    create(args: { data: CreateData }): Promise<Entity>;
    update(args: { where: { id: Id }; data: UpdateData }): Promise<Entity>;
    delete(args: { where: { id: Id } }): Promise<Entity>;
};

/**
 * Generic repository implementation backed by a Prisma model delegate.
 *
 * @typeParam Entity - Entity returned by read operations.
 * @typeParam CreateData - Data required to create an entity.
 * @typeParam UpdateData - Data required to update an entity.
 * @typeParam Id - Identifier type used to find, update, or delete an entity.
 *
 * @public
 */
export class PrismaRepository<Entity, CreateData = Entity, UpdateData = Partial<Entity>, Id = string>
    implements Repository<Entity, CreateData, UpdateData, Id>
{
    /**
     * Creates a Prisma repository using a Prisma model delegate.
     *
     * @param model - Prisma model delegate used to execute CRUD operations.
     */
    public constructor(private readonly model: PrismaModel<Entity, CreateData, UpdateData, Id>) {}

    /** Gets one entity by its identifier. */
    public getById(id: Id): Promise<Entity | null> {
        return this.model.findUnique({ where: { id } });
    }

    /** Gets all entities. */
    public getAll(): Promise<Entity[]> {
        return this.model.findMany();
    }

    /** Creates one entity. */
    public create(data: CreateData): Promise<Entity> {
        return this.model.create({ data });
    }

    /** Updates one entity by its identifier. */
    public update(id: Id, data: UpdateData): Promise<Entity> {
        return this.model.update({ where: { id }, data });
    }

    /** Deletes one entity by its identifier. */
    public async delete(id: Id): Promise<void> {
        await this.model.delete({ where: { id } });
    }
}
