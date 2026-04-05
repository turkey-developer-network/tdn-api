import { Type } from "@sinclair/typebox";
import { Type as FBType, type Static } from "@fastify/type-provider-typebox";
import { PostItemSchema } from "./get-post.schema";

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

export const GetUserPostsResponseSchema = FBType.Object({
    data: FBType.Array(PostItemSchema),
    meta: FBType.Object({
        total: FBType.Number(),
        currentPage: FBType.Number(),
        limit: FBType.Number(),
        totalPages: FBType.Number(),
    }),
});
export type GetUserPostsResponse = Static<typeof GetUserPostsResponseSchema>;
