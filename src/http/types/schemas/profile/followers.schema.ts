import { Type, type Static } from "@sinclair/typebox";

export const FollowersParamsSchema = Type.Object({
    username: Type.String(),
});
export type FollowersParams = Static<typeof FollowersParamsSchema>;

export const PaginationQuerySchema = Type.Object({
    limit: Type.Number({ default: 20, minimum: 1, maximum: 50 }),
    offset: Type.Number({ default: 0, minimum: 0 }),
});

export type PaginationQuery = Static<typeof PaginationQuerySchema>;
