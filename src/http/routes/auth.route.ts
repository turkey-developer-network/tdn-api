import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";
import {
    RegisterBodySchema,
    RegisterResponseSchema,
} from "@typings/schemas/auth.schema";

const authRoutes: FastifyPluginCallbackTypebox = (fastify, _opts, done) => {
    fastify.post(
        "/register",
        {
            schema: {
                body: RegisterBodySchema,
                response: { 201: RegisterResponseSchema },
            },
        },
        async (request, reply) => {
            const response = await fastify.authService.register(request.body);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reply.status(201).send(response as any);
        },
    );

    done();
};

export default authRoutes;
