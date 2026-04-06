import { Type } from "@sinclair/typebox";
import { type Static } from "@fastify/type-provider-typebox";

export const FollowUserBodySchema = Type.Object({
    targetId: Type.String({ format: "uuid" }),
});

export type FollowUserBody = Static<typeof FollowUserBodySchema>;

export const FollowActionResponseSchema = Type.Object({
    data: Type.Object({
        followersCount: Type.Number(),
    }),
    meta: Type.Object({ timestamp: Type.String({ format: "date-time" }) }),
});
export type FollowActionResponse = Static<typeof FollowActionResponseSchema>;
