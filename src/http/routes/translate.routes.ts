import { RateLimitPolicies } from "@plugins/rate-limit.plugin";
import {
    TranslateBodySchema,
    TranslateResponseSchema,
    type TranslateBody,
} from "@typings/schemas/translate/translate.schema";
import type { FastifyInstance } from "fastify";

export function translateRoutes(fastify: FastifyInstance): void {
    const { translationController } = fastify.diContainer.cradle;

    fastify.post<{ Body: TranslateBody }>(
        "/translate",
        {
            onRequest: [fastify.authenticate],
            schema: {
                body: TranslateBodySchema,
                response: { 200: TranslateResponseSchema },
                tags: ["Translation"],
            },
            config: { rateLimit: RateLimitPolicies.STANDARD },
        },
        translationController.translate.bind(translationController),
    );
}
