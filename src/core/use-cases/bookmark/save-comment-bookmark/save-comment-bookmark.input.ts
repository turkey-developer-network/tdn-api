/**
 * Input type for the SaveCommentBookmark use case, containing the necessary information to save a bookmark for a specific comment by a user. This input includes the comment ID to identify which comment is being bookmarked and the user ID to identify who is bookmarking the comment.
 */
export interface SaveCommentBookmarkInput {
    /**
     * The ID of the comment to be bookmarked
     */
    commentId: string;
    /**
     * The ID of the user who is bookmarking the comment
     */
    userId: string;
}
