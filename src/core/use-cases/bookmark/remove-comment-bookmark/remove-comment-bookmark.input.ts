/**
 * Input type for the RemoveCommentBookmark use case, containing the necessary information to identify which comment bookmark to remove for a specific user
 */
export interface RemoveCommentBookmarkInput {
    /**
     * The ID of the comment bookmark to be removed
     */
    commentId: string;
    /**
     * The ID of the user who owns the bookmark to be removed
     */
    userId: string;
}
