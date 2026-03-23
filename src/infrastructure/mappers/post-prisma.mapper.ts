import type { Post } from "@core/domain/entities/post.entity";
import type { PostType } from "@core/domain/enums/post-type.enum";

export class PostPrismaMapper {
    public static toPostOutput(post: Post): {
        id: string;
        content: string;
        type: PostType;
        mediaUrls: string[];
        author: {
            id: string;
            username: string;
            avatarUrl: string;
        };
        createdAt: Date;
        updatedAt: Date;
    } {
        return {
            id: post.id,
            content: post.content,
            type: post.type as PostType,
            mediaUrls: post.mediaUrls,
            author: {
                id: post.author.id,
                username: post.author.username || "",
                avatarUrl: post.author.avatarUrl || "",
            },
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    }
}
