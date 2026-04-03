import type { Comment } from "@core/domain/entities/comment.entity";

export interface ICommentBookmarkRepository {
    save(commentId: string, userId: string): Promise<void>;
    remove(commentId: string, userId: string): Promise<void>;
    isBookmarked(commentId: string, userId: string): Promise<boolean>;
    findBookmarkedByUserId(
        userId: string,
        limit: number,
        offset: number,
    ): Promise<{ comments: Comment[]; total: number }>;
}
