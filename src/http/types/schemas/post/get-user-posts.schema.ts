import { Type, type Static } from "@sinclair/typebox";

export const getUserPostsParamsSchema = Type.Object({
    username: Type.String({
        maxLength: 100,
    }),
});

export const getUserPostsQuerySchema = Type.Object({
    page: Type.Optional(Type.Number({ default: 1, minimum: 1 })),
    limit: Type.Optional(Type.Number({ default: 10, minimum: 1, maximum: 50 })),
    type: Type.Optional(Type.String()),
});

export type GetUserPostsParams = Static<typeof getUserPostsParamsSchema>;
export type GetUserPostsQuery = Static<typeof getUserPostsQuerySchema>;
