import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
    CreateOperationData,
    UpdateOperationData,
} from "../infraestructure/operationRepository";
import { OperationService } from "../services/operationService";
import { operationSchemas, errorSchema } from "./schemas";

type OperationParams = {
    id: string;
};

const idParamSchema = {
    type: "object",
    required: ["id"],
    properties: { id: { type: "string" } },
};

/** Registers operation HTTP routes. */
export class OperationRoutes {
    private readonly BASE_PATH = "/api/operations"; 

    public constructor(private readonly operationService: OperationService) {
        this.operationService = operationService;
    }

    public register(server: FastifyInstance): void {
        server.get(this.BASE_PATH, {
            schema: {
                tags: ["Operations"],
                summary: "Get all operations",
                description: "Returns a list of all registered operations.",
                response: {
                    200: { type: "array", items: operationSchemas.Operation },
                },
            },
        }, this.getAll.bind(this));

        server.get(`${this.BASE_PATH}/:id`, {
            schema: {
                tags: ["Operations"],
                summary: "Get operation by ID",
                description: "Returns a single operation by its identifier.",
                params: idParamSchema,
                response: {
                    200: operationSchemas.Operation,
                    404: errorSchema,
                },
            },
        }, this.getById.bind(this));

        server.post(this.BASE_PATH, {
            schema: {
                tags: ["Operations"],
                summary: "Create a new operation",
                description: "Creates a new operation with the provided data.",
                body: operationSchemas.CreateOperation,
                response: {
                    201: operationSchemas.Operation,
                },
            },
        }, this.create.bind(this));

        server.patch(`${this.BASE_PATH}/:id`, {
            schema: {
                tags: ["Operations"],
                summary: "Update an operation",
                description: "Updates an existing operation by its identifier.",
                params: idParamSchema,
                body: operationSchemas.UpdateOperation,
                response: {
                    200: operationSchemas.Operation,
                },
            },
        }, this.update.bind(this));

        server.delete(`${this.BASE_PATH}/:id`, {
            schema: {
                tags: ["Operations"],
                summary: "Delete an operation",
                description: "Deletes an operation by its identifier.",
                params: idParamSchema,
                response: {
                    204: { description: "Operation deleted" },
                },
            },
        }, this.delete.bind(this));
    }

    private async getAll(): Promise<unknown> {
        return await this.operationService.getAll();
    }

    private async getById(
        request: FastifyRequest<{ Params: OperationParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const operation = await this.operationService.getById(Number(request.params.id));

        if (operation === null) {
            return reply.status(404).send({ message: "Operation not found" });
        }

        return operation;
    }

    private async create(
        request: FastifyRequest<{ Body: CreateOperationData }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        const { label, name, operation, permissionId, permisosId, tool } = request.body;
        const createdOperation = await this.operationService.create({ label, name, operation, permissionId, permisosId, tool });

        return reply.status(201).send(createdOperation);
    }

    private async update(
        request: FastifyRequest<{ Params: OperationParams; Body: UpdateOperationData }>,
    ): Promise<unknown> {
        return await this.operationService.update(Number(request.params.id), request.body);
    }

    private async delete(
        request: FastifyRequest<{ Params: OperationParams }>,
        reply: FastifyReply,
    ): Promise<unknown> {
        await this.operationService.delete(Number(request.params.id));

        return reply.status(204).send();
    }
}
