import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetUserNotificatonUseCase } from "@core/use-cases/notification/get-user-notification.usecase";
import type { GetNotificationsQuery } from "@typings/schemas/notification/get-notification.schema";

export default class NotificationController {
    constructor(
        private readonly getUserNotificationsUseCase: GetUserNotificatonUseCase,
    ) {}

    async getNotifications(
        request: FastifyRequest<{
            Querystring: GetNotificationsQuery;
        }>,
        reply: FastifyReply,
    ): Promise<void> {
        const { page = 1, limit = 10 } = request.query;
        const userId = request.user.id;

        const response = await this.getUserNotificationsUseCase.execute({
            userId,
            page,
            limit,
        });

        return reply.status(200).send({
            success: true,
            data: response.notifications,
            meta: {
                total: response.total,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
            },
        });
    }
}
