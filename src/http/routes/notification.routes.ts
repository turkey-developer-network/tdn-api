/**
 * Notification routes module
 *
 * This module defines API endpoints for notification management including:
 * - Retrieving user notifications with pagination and filtering
 * - Marking all notifications as read
 *
 * @author TDN Team
 * @version 1.0.0
 */

import { RateLimitPolicies } from "@plugins/rate-limit.plugin";
import {
    GetNotificationsQuerySchema,
    type GetNotificationsQuery,
    GetNotificationsResponseSchema,
    type GetNotificationsResponse,
    MarkAllReadResponseSchema,
} from "@typings/schemas/notification/get-notification.schema";
import type { FastifyInstance } from "fastify";

/**
 * Sets up notification routes on the Fastify instance
 *
 * @param fastify - The Fastify application instance
 * @returns void
 */
export default function notificationRoutes(fastify: FastifyInstance): void {
    const notificationController =
        fastify.diContainer.cradle.notificationController;

    fastify.get<{
        Querystring: GetNotificationsQuery;
        Reply: { 200: GetNotificationsResponse };
    }>(
        "/notifications",
        {
            onRequest: [fastify.authenticate],
            schema: {
                querystring: GetNotificationsQuerySchema,
                response: { 200: GetNotificationsResponseSchema },
                tags: ["Notification"],
            },
            config: { rateLimit: RateLimitPolicies.STANDARD },
        },
        notificationController.getNotifications.bind(notificationController),
    );

    fastify.patch(
        "/notifications/read-all",
        {
            onRequest: [fastify.authenticate],
            config: { rateLimit: RateLimitPolicies.STANDARD },
            schema: {
                response: { 200: MarkAllReadResponseSchema },
                tags: ["Notification"],
            },
        },
        notificationController.markAllAsRead.bind(notificationController),
    );
}
