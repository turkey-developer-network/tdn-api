import type { GetTrendsUseCase } from "@core/use-cases/post/get-trends";
import type { SearchTagsUseCase } from "@core/use-cases/tag/search-tag";
import type { SearchTagsQuery } from "@typings/schemas/tag/search-tag.schema";
import type { GetTrendsQuery } from "@typings/schemas/trends/get-trends.schema";
import type { FastifyReply, FastifyRequest } from "fastify";

const TREND_WINDOW_DAYS = 7;

export class TrendController {
    constructor(
        private readonly getTrendsUseCase: GetTrendsUseCase,
        private readonly searchTagsUseCase: SearchTagsUseCase,
    ) {}

    async getTrends(
        request: FastifyRequest<{ Querystring: GetTrendsQuery }>,
        reply: FastifyReply,
    ): Promise<void> {
        const { limit } = request.query;

        const { trends } = await this.getTrendsUseCase.execute({ limit });

        return reply.status(200).send({
            data: { trends },
            meta: {
                timestamp: new Date().toISOString(),
                windowDays: TREND_WINDOW_DAYS,
            },
        });
    }

    async searchTags(
        request: FastifyRequest<{ Querystring: SearchTagsQuery }>,
        reply: FastifyReply,
    ): Promise<void> {
        const { q, limit } = request.query;

        const results = await this.searchTagsUseCase.execute({
            query: q,
            limit,
        });

        return reply.status(200).send({
            data: results,
            meta: {
                timestamp: new Date().toISOString(),
                count: results.length,
            },
        });
    }
}
