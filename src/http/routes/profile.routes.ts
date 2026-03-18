import { RateLimitPolicies } from "@plugins/rate-limit.plugin";
import {
    type GetProfileParams,
    GetProfileParamsSchema,
} from "@typings/schemas/profile/get-profile.schema";
import {
    type UpdateProfileBody,
    UpdateProfileBodySchema,
} from "@typings/schemas/profile/update-profile.schema";
import type { FastifyInstance, FastifyRequest } from "fastify";

function profileRoutes(fastify: FastifyInstance): void {
    const profileController = fastify.diContainer.cradle.profileController;

    fastify.patch(
        "/me/avatar",
        {
            onRequest: [fastify.authenticate],
            config: {
                rateLimit: RateLimitPolicies.STRICT,
            },
        },
        profileController.uploadAvatarMe.bind(profileController),
    );

    fastify.patch(
        "/me/banner",
        {
            onRequest: [fastify.authenticate],
            config: {
                rateLimit: RateLimitPolicies.STRICT,
            },
        },
        profileController.uploadBannerMe.bind(profileController),
    );

    fastify.patch<{ Body: UpdateProfileBody }>(
        "/me",
        {
            schema: {
                body: UpdateProfileBodySchema,
            },
            onRequest: [fastify.authenticate],
        },
        profileController.updateProfileMe.bind(profileController),
    );

    fastify.get<{ Params: GetProfileParams }>(
        "/:username",
        {
            schema: {
                params: GetProfileParamsSchema,
            },
            onRequest: async (request: FastifyRequest) => {
                if (request.headers.authorization) {
                    await request.jwtVerify();
                }
            },
        },
        profileController.getProfile.bind(profileController),
    );
}

export default profileRoutes;
