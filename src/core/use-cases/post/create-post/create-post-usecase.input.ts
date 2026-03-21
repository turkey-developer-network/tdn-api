import type { PostType } from "@core/ports/repositories/post.repository";

export interface CreatePostInput {
    authorId: string;
    content: string;
    type: PostType;
    mediaUrls?: string[];
}
