import type { PostType } from "@core/domain/enums/post-type.enum";

export interface CreatePostInput {
    authorId: string;
    content: string;
    type: PostType;
    mediaUrls?: string[];
}
