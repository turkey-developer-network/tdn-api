import { Type } from "@sinclair/typebox";
import { type Static } from "@fastify/type-provider-typebox";
import { MetaOnlyResponseSchema } from "../create-response-schema";

export const FollowUserBodySchema = Type.Object({
    targetId: Type.String({ format: "uuid" }),
});

export type FollowUserBody = Static<typeof FollowUserBodySchema>;

export const FollowActionResponseSchema = MetaOnlyResponseSchema;
export type FollowActionResponse = Static<typeof FollowActionResponseSchema>;
