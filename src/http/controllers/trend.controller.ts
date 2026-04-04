import type { GetTrendsUseCase } from "@core/use-cases/post/get-trends";
import type { GetTrendsQuery } from "@typings/schemas/trends/get-trends.schema";
import type { FastifyReply, FastifyRequest } from "fastify";

const TREND_WINDOW_DAYS = 7;

export class TrendController {
    constructor(private readonly getTrendsUseCase: GetTrendsUseCase) {}

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
}
