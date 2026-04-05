import { Type } from "@sinclair/typebox";
import { type Static } from "@fastify/type-provider-typebox";
import { MetaOnlyResponseSchema } from "../create-response-schema";

export const commentActionParamsSchema = Type.Object({
    commentId: Type.String({ format: "uuid", description: "Comment ID" }),
});

export type CommentActionParams = Static<typeof commentActionParamsSchema>;

export const CommentActionResponseSchema = MetaOnlyResponseSchema;
export type CommentActionResponse = Static<typeof CommentActionResponseSchema>;
