import { Type } from "@sinclair/typebox";
import { type Static } from "@fastify/type-provider-typebox";
import { PostType } from "@core/domain/enums/post-type.enum";
import { ResponseSchema } from "../create-response-schema";
import { PostItemSchema } from "./get-post.schema";

export const createPostBodySchema = Type.Object({
    content: Type.String({
        minLength: 1,
        maxLength: 300,
    }),
    type: Type.Enum(PostType, {
        default: PostType.COMMUNITY,
    }),
    mediaUrls: Type.Optional(
        Type.Array(
            Type.String({
                format: "uri",
            }),
            {
                maxItems: 4,
            },
        ),
    ),
});

export type CreatePostBody = Static<typeof createPostBodySchema>;

export const CreatePostResponseSchema = ResponseSchema(PostItemSchema);
export type CreatePostResponse = Static<typeof CreatePostResponseSchema>;
