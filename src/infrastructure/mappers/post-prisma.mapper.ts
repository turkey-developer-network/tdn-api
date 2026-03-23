import type { PostOutput } from "@core/ports/repositories/post.repository";
import type { Post } from "@core/domain/entities/post.entity";
import type { PostType } from "@core/domain/enums/post-type.enum";

export class PostPrismaMapper {
    public static toPostOutput(post: Post): PostOutput {
        return {
            id: post.id,
            content: post.content,
            type: post.type as PostType,
            mediaUrls: post.mediaUrls,
            author: post.author,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    }
}
