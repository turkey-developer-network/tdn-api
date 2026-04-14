/**
 * Input type for the GetComment use case, which defines the necessary parameters to retrieve a comment by its ID. This input includes the comment ID and an optional current user ID, which can be used to determine if the current user has any specific interactions with the comment (e.g., if they have bookmarked it). The comment ID is required to identify which comment to retrieve, while the current user ID is optional and can be used for additional context when fetching the comment data.
 */
export interface GetCommentUseCaseInput {
    /**
     * The ID of the comment to be retrieved, used to identify which comment to fetch from the repository
     */
    commentId: string;
    /**
     * Optional ID of the current user making the request, which can be used to determine if the user has any specific interactions with the comment (e.g., if they have bookmarked it). This can provide additional context when fetching the comment data, such as whether to include information about the user's interactions with the comment.
     */
    currentUserId?: string;
}
