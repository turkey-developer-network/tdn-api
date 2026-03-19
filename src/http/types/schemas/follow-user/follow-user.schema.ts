import { Type, type Static } from "@sinclair/typebox";

export const FollowUserBodySchema = Type.Object({
    targetId: Type.String({ format: "uuid" }),
});

export type FollowUserBody = Static<typeof FollowUserBodySchema>;
