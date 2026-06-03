import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
    CreateOperationData,
    UpdateOperationData,
} from "../infraestructure/operationRepository";
import { OperationService } from "../services/operationService";

type OperationParams = {
    id: string;
};

/** Registers operation HTTP routes. */
export class OperationRoutes {
    private readonly BASE_PATH = "/api/operations"; 

    public constructor(private readonly operationService: OperationService) {
        this.operationService = operationService;
    }

    public register(server: FastifyInstance): void {
        server.get(this.BASE_PATH, this.getAll.bind(this));
        server.get(`${this.BASE_PATH}/:id`, this.getById.bind(this));
        server.post(this.BASE_PATH, this.create.bind(this));
        server.put(`${this.BASE_PATH}/:id`, this.update.bind(this));
        server.delete(`${this.BASE_PATH}/:id`, this.delete.bind(this));
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
