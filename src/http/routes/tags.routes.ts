import { RateLimitPolicies } from "@plugins/rate-limit.plugin";
import {
    getTrendsQuerySchema,
    GetTrendsResponseSchema,
    type GetTrendsQuery,
} from "@typings/schemas/trends/get-trends.schema";
import {
    SearchTagsQuerySchema,
    SearchTagsResponseSchema,
    type SearchTagsQuery,
} from "@typings/schemas/tag/search-tag.schema";
import type { FastifyInstance } from "fastify";

export function tagRoutes(fastify: FastifyInstance): void {
    const { trendController } = fastify.diContainer.cradle;

    fastify.get<{ Querystring: GetTrendsQuery }>(
        "/trends",
        {
            schema: {
                querystring: getTrendsQuerySchema,
                response: { 200: GetTrendsResponseSchema },
                tags: ["Tags"],
            },
            config: { rateLimit: RateLimitPolicies.PUBLIC },
        },
        trendController.getTrends.bind(trendController),
    );

    fastify.get<{ Querystring: SearchTagsQuery }>(
        "/search",
        {
            schema: {
                querystring: SearchTagsQuerySchema,
                response: { 200: SearchTagsResponseSchema },
                tags: ["Tags"],
            },
            config: { rateLimit: RateLimitPolicies.PUBLIC },
        },
        trendController.searchTags.bind(trendController),
    );
}
