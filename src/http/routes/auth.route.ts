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
            const user = await fastify.authService.register({
                email: request.body.email,
                username: request.body.username,
                password: request.body.password,
            });

            const responseData = {
                id: user.id,
                username: user.username,
                createdAt: user.createdAt.toISOString(),
            };

            reply.status(201);
            return responseData as unknown as RegisterResponse;
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
            const deviceIp = request.ip;
            const userAgent = request.headers["user-agent"] || "Unknown Device";

            const response = await fastify.authService.login({
                identifier: request.body.identifier,
                password: request.body.password,
                deviceIp,
                userAgent,
            });

            reply.setCookie("refreshToken", response.refreshToken, {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires: response.refreshTokenExpiresAt,
                signed: true,
            });

            const responseData = {
                accessToken: response.accessToken,
                expiresAt: response.expiresAt,
                user: response.user,
            };

            reply.status(200);
            return responseData as unknown as LoginResponse;
        },
    );

    done();
};

export default authRoutes;
