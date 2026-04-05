import { Type } from "@sinclair/typebox";
import { Type as FBType, type Static } from "@fastify/type-provider-typebox";
import { CommentItemSchema } from "./get-comment.schema";

export const getPostCommentsParamsSchema = Type.Object({
    postId: Type.String({ format: "uuid", description: "Post ID" }),
});

export const getPostCommentsQuerySchema = Type.Object({
    page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 50, default: 10 })),
});

export type GetPostCommentsParams = Static<typeof getPostCommentsParamsSchema>;
export type GetPostCommentsQuery = Static<typeof getPostCommentsQuerySchema>;

export const GetPostCommentsResponseSchema = FBType.Object({
    data: FBType.Array(CommentItemSchema),
    meta: FBType.Object({
        currentPage: FBType.Number(),
        limit: FBType.Number(),
    }),
});
export type GetPostCommentsResponse = Static<
    typeof GetPostCommentsResponseSchema
>;
