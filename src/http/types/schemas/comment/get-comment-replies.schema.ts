import { Type } from "@sinclair/typebox";
import { Type as FBType, type Static } from "@fastify/type-provider-typebox";
import { CommentItemSchema } from "./get-comment.schema";

export const getCommentRepliesParamsSchema = Type.Object({
    commentId: Type.String({ format: "uuid", description: "Comment ID" }),
});

export const getCommentRepliesQuerySchema = Type.Object({
    page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 50, default: 10 })),
});

export type GetCommentRepliesParams = Static<
    typeof getCommentRepliesParamsSchema
>;
export type GetCommentRepliesQuery = Static<
    typeof getCommentRepliesQuerySchema
>;

export const GetCommentRepliesResponseSchema = FBType.Object({
    data: FBType.Array(CommentItemSchema),
    meta: FBType.Object({
        currentPage: FBType.Number(),
        limit: FBType.Number(),
    }),
});
export type GetCommentRepliesResponse = Static<
    typeof GetCommentRepliesResponseSchema
>;
