import fastifyPlugin from "fastify-plugin";
import fastifyRateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";
import { TooManyRequestsError } from "@core/errors/too-many-requests.error";

function rateLimitPlugin(fastify: FastifyInstance): void {
    fastify.register(fastifyRateLimit, {
        global: true,
        max: 100,
        timeWindow: "1 minute",

        errorResponseBuilder: () => {
            throw new TooManyRequestsError();
        },
    });
}

export default fastifyPlugin(rateLimitPlugin);
