/**
 * Use case for retrieving a user's bookmarked posts and comments
 */
import type { IPostRepository } from "@core/ports/repositories/post.repository";
import type { ICommentBookmarkRepository } from "@core/ports/repositories/comment-bookmark.repository";
import type { GetBookmarksUseCaseInput } from "./get-bookmarks-usecase.input";
import type { Post } from "@core/domain/entities/post.entity";
import type { Comment } from "@core/domain/entities/comment.entity";

export class GetBookmarksUseCase {
    /**
     * @param postRepository - Repository for accessing posts, used to retrieve bookmarked posts
     * @param commentBookmarkRepository - Repository for accessing comment bookmarks, used to retrieve bookmarked comments
     */
    constructor(
        private readonly postRepository: IPostRepository,
        private readonly commentBookmarkRepository: ICommentBookmarkRepository,
    ) {}
    /**
     * Executes the use case to retrieve a user's bookmarked posts and comments based on the provided input
     * @param input - The input containing the user ID and optional pagination parameters
     * @returns An object containing arrays of bookmarked posts and comments, along with their respective total counts for pagination purposes
     */
    async execute(input: GetBookmarksUseCaseInput): Promise<{
        posts: Post[];
        postTotal: number;
        comments: Comment[];
        commentTotal: number;
    }> {
        const page = input.page || 1;
        const limit = input.limit || 10;
        const offset = (page - 1) * limit;

        const [postResult, commentResult] = await Promise.all([
            this.postRepository.findAll({
                page,
                limit,
                savedByUserId: input.userId,
                currentUserId: input.userId,
            }),
            this.commentBookmarkRepository.findBookmarkedByUserId(
                input.userId,
                limit,
                offset,
            ),
        ]);

        return {
            posts: postResult.posts,
            postTotal: postResult.total,
            comments: commentResult.comments,
            commentTotal: commentResult.total,
        };
    }
}
