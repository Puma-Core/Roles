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
    findUnique(args: { where: Record<string, unknown> }): Promise<Entity | null>;
    findFirst(args: { where: Partial<Record<keyof Entity, unknown>> }): Promise<Entity | null>;
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
     * Creates a Prisma repository using a Prisma client instance and model name.
     *
     * @param nameTable - Prisma model name used to select the delegate from the Prisma client.
     * @param prisma - Prisma client instance used to execute CRUD operations.
     */
    public constructor(
        private readonly nameTable: string,
        private readonly prisma: Record<string, PrismaModel<Entity, CreateData, UpdateData, Id>>,
    ) {}

    private get model(): PrismaModel<Entity, CreateData, UpdateData, Id> {
        return this.prisma[this.nameTable];
    }

    /** Gets one entity by its identifier. */
    public async getById(id: Id): Promise<Entity | null> {
        return await this.model.findUnique({ where: { id } });
    }

    /** Gets the first entity that matches a specific criteria. */
    public async getBy(where: Partial<Record<keyof Entity, unknown>>): Promise<Entity | null> {
        return await this.model.findFirst({ where });
    }

    /** Gets all entities. */
    public async getAll(): Promise<Entity[]> {
        return await this.model.findMany();
    }

    /** Creates one entity. */
    public async create(data: CreateData): Promise<Entity> {
        return await this.model.create({ data });
    }

    /** Updates one entity by its identifier. */
    public async update(id: Id, data: UpdateData): Promise<Entity> {
        return await this.model.update({ where: { id }, data });
    }

    /** Deletes one entity by its identifier. */
    public async delete(id: Id): Promise<void> {
        await this.model.delete({ where: { id } });
    }
}
