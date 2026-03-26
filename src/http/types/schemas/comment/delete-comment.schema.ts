import { Type, type Static } from "@sinclair/typebox";

export const deleteCommentParamsSchema = Type.Object({
    id: Type.String({ format: "uuid", description: "Post ID" }),
    commentId: Type.String({
        format: "uuid",
    }),
});

export type DeleteCommentParams = Static<typeof deleteCommentParamsSchema>;
