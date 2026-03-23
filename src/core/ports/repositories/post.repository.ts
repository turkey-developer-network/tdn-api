import type { PostType } from "@core/domain/enums/post-type.enum";
import type { Post } from "@core/domain/entities/post.entity";

export interface CreatePostInput {
    content: string;
    type: PostType;
    mediaUrls?: string[];
    authorId: string;
}

export interface GetPostsParams {
    page: number;
    limit: number;
    type?: PostType;
}

export interface PaginatedPosts {
    posts: PostOutput[];
    total: number;
}

export interface PostOutput {
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
}

export interface IPostRepository {
    create(data: CreatePostInput): Promise<void>;
    findAll(params: GetPostsParams): Promise<PaginatedPosts>;
    findById(id: string): Promise<Post | null>;
    delete(id: string): Promise<void>;
}
