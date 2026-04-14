/**
 * Input type for the LikeComment use case, containing the necessary information to perform the action of liking a comment. This includes the ID of the comment being liked and the ID of the user performing the like action, which are essential for updating the comment's like count and potentially triggering notifications or other related processes.
 */
export interface LikeCommentUseCaseInput {
    /**
     * The ID of the comment that is being liked, used to identify which comment's like count should be updated and to associate the like action with the correct comment in the system
     */
    commentId: string;
    /**
     * The ID of the user who is liking the comment, used to track which user performed the like action and to ensure that users can only like a comment once. This information can also be used for personalization and to trigger notifications for the comment's author or other relevant users when a comment receives a new like.
     */
    userId: string;
}
