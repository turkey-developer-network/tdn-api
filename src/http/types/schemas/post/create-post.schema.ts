import { Type, type Static } from "@sinclair/typebox";
import { PostType } from "@core/domain/enums/post-type.enum";

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
