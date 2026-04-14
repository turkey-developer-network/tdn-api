/**
 * Input type for the UnlikeComment use case, containing the necessary information to identify the comment being unliked and the user performing the action. This input is used to execute the use case logic for unliking a comment, ensuring that the appropriate comment is identified and the user's like is removed accordingly.
 */
export interface UnlikeCommentUseCaseInput {
    /**
     * The ID of the comment that is being unliked, used to identify which comment's like should be removed and to associate the unlike action with the correct comment in the system
     */
    commentId: string;
    /**
     * The ID of the user who is unliking the comment, used to track which user performed the unlike action and to ensure that the correct like is removed from the comment. This information can also be used for personalization and to trigger notifications for the comment's author or other relevant users when a comment receives an unlike action from a user.
     */
    userId: string;
}
