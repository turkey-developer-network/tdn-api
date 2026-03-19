import {
    type FollowUserBody,
    FollowUserBodySchema,
} from "@typings/schemas/follow-user/follow-user.schema";
import type { FastifyInstance } from "fastify";

export default function followRoutes(fastify: FastifyInstance): void {
    const followController = fastify.diContainer.cradle.followUserController;

    fastify.post<{ Body: FollowUserBody }>(
        "/",
        {
            schema: {
                body: FollowUserBodySchema,
            },
            onRequest: [fastify.authenticate],
        },
        followController.follow.bind(followController),
    );

    fastify.delete<{ Body: FollowUserBody }>(
        "/",
        {
            schema: {
                body: FollowUserBodySchema,
            },
            onRequest: [fastify.authenticate],
        },
        followController.unfollow.bind(followController),
    );
}
