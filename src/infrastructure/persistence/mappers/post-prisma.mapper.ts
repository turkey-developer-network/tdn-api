import { Post } from "@core/domain/entities/post.entity";
import type { PostType } from "@core/domain/enums/post-type.enum";
import type { Prisma } from "@generated/prisma/client";

export type PostWithRelations = Prisma.PostGetPayload<{
    include: {
        author: {
            select: {
                id: true;
                username: true;
                profile: { select: { avatarUrl: true } };
            };
        };
        tags: true;
    };
}>;

export interface PostResponse {
    id: string;
    content: string;
    type: string;
    mediaUrls: string[];
    createdAt: Date;
    likeCount: number;
    commentCount: number;
    author: {
        id: string;
        username?: string;
        avatarUrl: string;
    };
}

/**
 * Mapper class for converting between Post entities and Prisma data structures
 *
 * Provides utility methods for transforming Post domain entities to and from
 * the data structures used by Prisma ORM. This ensures clean separation between
 * the domain layer and the persistence layer.
 */
export class PostPrismaMapper {
    static toDomain(raw: PostWithRelations): Post {
        return new Post({
            id: raw.id,
            content: raw.content,
            type: raw.type as PostType,
            mediaUrls: raw.mediaUrls,

            author: {
                id: raw.authorId,
                username: raw.author?.username ?? undefined,
                avatarUrl: raw.author?.profile?.avatarUrl ?? undefined,
            },

            tags: raw.tags?.map((t) => t.name) || [],

            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            likeCount: raw.likeCount,
            commentCount: raw.commentCount,
        });
    }

    /**
     * Maps a Post entity to a response object
     * @param post - The Post entity
     * @param isBookmarked - Optional flag indicating if the post is bookmarked by the current user
     * @returns A response object with post data
     */
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
        likeCount: number;
        commentCount: number;
        isBookmarked?: boolean;
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
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            isBookmarked: post.isBookmarked,
        };
    }

    /**
     * Maps a Post entity to Prisma post data
     * @param post - The Post entity
     * @returns Prisma post data
     */
    public static toPrisma(post: Post): {
        content: string;
        type: PostType;
        mediaUrls: string[];
        authorId: string;
    } {
        return {
            content: post.content,
            type: post.type as PostType,
            mediaUrls: post.mediaUrls,
            authorId: post.author.id,
        };
    }

    static toResponse(post: Post, cdnUrl: string): PostResponse {
        return {
            id: post.id,
            content: post.content,
            type: post.type,
            mediaUrls: post.mediaUrls,
            createdAt: post.createdAt,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            author: {
                id: post.author.id,
                username: post.author.username,

                avatarUrl: post.author.avatarUrl
                    ? post.author.avatarUrl.startsWith("http")
                        ? post.author.avatarUrl
                        : `${cdnUrl}/${post.author.avatarUrl}`
                    : `${cdnUrl}/default-avatar.png`,
            },
        };
    }

    static toFeedResponse(posts: Post[], cdnUrl: string): PostResponse[] {
        return posts.map((post) => this.toResponse(post, cdnUrl));
    }
}
