import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export async function registerSwagger(server: FastifyInstance): Promise<void> {
    await server.register(swagger, {
        openapi: {
            openapi: '3.1.0',
            info: {
                title: 'My Fastify API',
                description: 'Testing the Fastify OpenAPI implementation',
                version: '1.0.0'
            },
            servers: [{ url: "/" }],
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
        },
    });

    await server.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        }
    });
}
