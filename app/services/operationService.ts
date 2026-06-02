import {
    CreateOperationData,
    OperationRepository,
    UpdateOperationData,
} from "../infraestructure/operationRepository";
import { Operation } from "../domains/operations";

/**
 * Service layer for operation use cases.
 *
 * This service depends on OperationRepository and does not know which ORM or database driver is used.
 *
 * @public
 */
export class OperationService {
    /**
     * Creates the operation service.
     *
     * @param operationRepository - Repository used to access operation data.
     */
    public constructor(private readonly operationRepository: OperationRepository) {
        this.operationRepository = operationRepository;
    }

    /** Gets one operation by its identifier. */
    public getById(id: string): Promise<Operation | null> {
        return this.operationRepository.getById(id);
    }

    /** Gets all operations. */
    public getAll(): Promise<Operation[]> {
        return this.operationRepository.getAll();
    }

    /** Creates one operation. */
    public create(data: CreateOperationData): Promise<Operation> {
        return this.operationRepository.create(data);
    }

    /** Updates one operation by its identifier. */
    public update(id: string, data: UpdateOperationData): Promise<Operation> {
        return this.operationRepository.update(id, data);
    }

    /** Deletes one operation by its identifier. */
    public delete(id: string): Promise<void> {
        return this.operationRepository.delete(id);
    }
}
