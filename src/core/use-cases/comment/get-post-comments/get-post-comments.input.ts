/**
 * Input type for the GetPostComments use case, defining the necessary parameters to retrieve comments for a specific post, including pagination options and an optional current user ID for context
 */
export interface GetPostCommentsUseCaseInput {
    /**
     * The ID of the post for which to retrieve comments, used to identify which post's comments to fetch from the repository
     */
    postId: string;
    /**
     * The page number for pagination, used to determine which set of comments to return based on the specified limit. This allows clients to fetch comments in chunks rather than retrieving all comments at once, improving performance and user experience when dealing with a large number of comments.
     */
    page?: number;
    /**
     * The number of comments to return per page, used in conjunction with the page parameter to control the pagination of comments. This allows clients to specify how many comments they want to receive in each response, enabling efficient data retrieval and reducing the load on the server when there are many comments on a post.
     */
    limit?: number;
    /**
     * Optional ID of the current user making the request, which can be used to personalize the response based on the user's context. For example, this can be used to indicate whether the user has liked any of the comments or to include additional information relevant to the user's interactions with the comments. This parameter is optional because it may not always be necessary to provide user-specific context when fetching post comments, depending on the use case and client requirements.
     */
    currentUserId?: string;
}
