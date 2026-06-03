import { BaseRepository, RepositoryConstructor } from "./baseRepository";
import { Operation } from "../domains/operations";
import { OperationValues } from "../domains/interfaces/operations";

/** Data required to create an operation. */
export type CreateOperationData = Omit<OperationValues, "id">;

/** Data allowed to update an operation. */
export type UpdateOperationData = Partial<CreateOperationData>;

/**
 * Operation repository bound to the operation domain model.
 *
 * The concrete storage implementation is provided through the constructor, so this repository
 * does not need to know which ORM or database driver is being used.
 *
 * @public
 */
export class OperationRepository extends BaseRepository<Operation, CreateOperationData, UpdateOperationData, number> {
    /** Prisma model name used by the concrete repository implementation. */
    public static readonly TABLE_NAME = "Operation";
    public static readonly MODEL = Operation;

    /**
     * Creates an operation repository using the provided repository implementation.
     *
     * @param repositoryClass - Repository implementation class to instantiate.
     * @param args - Arguments passed to the repository implementation constructor.
     */
    public constructor(
        repositoryClass: RepositoryConstructor<Operation, CreateOperationData, UpdateOperationData, number>,
        ...args: unknown[]
    ) {
        super(
            repositoryClass,
            OperationRepository.TABLE_NAME,
            OperationRepository.MODEL,
            ...args
        );
    }
}
