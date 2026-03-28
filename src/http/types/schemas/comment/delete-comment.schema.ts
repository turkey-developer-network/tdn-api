import { Type, type Static } from "@sinclair/typebox";

export const deleteCommentParamsSchema = Type.Object({
    commentId: Type.String({
        format: "uuid",
        description: "The ID of the Comment to delete",
    }),
});

export type DeleteCommentParams = Static<typeof deleteCommentParamsSchema>;
