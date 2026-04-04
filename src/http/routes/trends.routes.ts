import { RateLimitPolicies } from "@plugins/rate-limit.plugin";
import {
    getTrendsQuerySchema,
    type GetTrendsQuery,
} from "@typings/schemas/trends/get-trends.schema";
import type { FastifyInstance } from "fastify";

export function trendRoutes(fastify: FastifyInstance): void {
    const { trendController } = fastify.diContainer.cradle;

    fastify.get<{ Querystring: GetTrendsQuery }>(
        "/trends",
        {
            schema: {
                querystring: getTrendsQuerySchema,
                tags: ["Trend"],
            },
            config: { rateLimit: RateLimitPolicies.PUBLIC },
        },
        trendController.getTrends.bind(trendController),
    );
}
