/**
 * Input type for the GetCommentReplies use case, which defines the necessary parameters to retrieve replies for a specific comment. This includes the comment ID to identify which comment's replies to fetch, pagination parameters (page and limit) to control the number of replies returned, and an optional currentUserId to personalize the response based on the user's context (e.g., to indicate if the user has liked any of the replies).
 */
export interface GetCommentRepliesUseCaseInput {
    /**
     * The ID of the comment for which to retrieve replies, used to identify the parent comment in the repository and fetch its associated replies
     */
    commentId: string;
    /**
     * The page number for pagination, used to determine which set of replies to return based on the specified limit. This allows clients to fetch replies in chunks rather than retrieving all replies at once, improving performance and user experience when dealing with a large number of replies.
     */
    page: number;
    /**
     * The number of replies to return per page, used in conjunction with the page parameter to control the pagination of replies. This allows clients to specify how many replies they want to receive in each response, enabling efficient data retrieval and reducing the load on the server when there are many replies to a comment.
     */
    limit: number;
    /**
     * Optional ID of the current user making the request, which can be used to personalize the response based on the user's context. For example, this can be used to indicate whether the user has liked any of the replies or to include additional information relevant to the user's interactions with the replies. This parameter is optional because it may not always be necessary to provide user-specific context when fetching comment replies, depending on the use case and client requirements.
     */
    currentUserId?: string;
}
