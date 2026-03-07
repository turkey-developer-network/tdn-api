import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";
import {
    RegisterBodySchema,
    RegisterResponseSchema,
    LoginBodySchema,
    LoginResponseSchema,
    type RegisterResponse,
    type LoginResponse,
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
            reply.status(201);
            return response as unknown as RegisterResponse;
        },
    );

    fastify.post(
        "/login",
        {
            schema: {
                body: LoginBodySchema,
                response: {
                    200: LoginResponseSchema,
                },
            },
        },
        async (request, reply) => {
            const response = await fastify.authService.login(request.body);
            reply.status(200);
            return response as unknown as LoginResponse;
        },
    );

    done();
};

export default authRoutes;
