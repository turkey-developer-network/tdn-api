import type { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";
import { RegisterBodySchema } from "@typings/schemas/auth.schema";

const authRoutes: FastifyPluginCallbackTypebox = (fastify, _opts, done) => {
    fastify.post(
        "/register",
        { schema: { body: RegisterBodySchema } },
        async (req) => {
            const { id, username, createdAt } =
                await fastify.authService.register(req.body);

            return {
                id,
                username,
                createdAt: createdAt.toISOString(),
            };
        },
    );

    done();
};

export default authRoutes;
