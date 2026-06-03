import { OperationValues, OperationType } from "./interfaces/operations";

/**
 * Represents an operation domain model.
 *
 * @public
 */
export class Operation {
    /** Unique operation identifier. */
    public id: number;

    /** Human-readable operation label. */
    public label: string;

    /** Unique operation name. */
    public name: string;

    /** Tool associated with the operation. */
    public tool: string;

    /** Operations enabled for this operation model. */
    public operation: OperationType[];

    /** Permission identifier associated with this operation. */
    public permissionId?: number;

    /** Legacy permisos identifier associated with this operation. */
    public permisosId?: number;

    /**
     * Creates an operation domain model.
     *
     * @param values - Values used to initialize the operation.
     */
    public constructor(values: OperationValues) {
        this.id = values.id;
        this.label = values.label;
        this.name = values.name;
        this.tool = values.tool;
        this.operation = values.operation;
        this.permissionId = values.permissionId;
        this.permisosId = values.permisosId;
    }
}
