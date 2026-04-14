/**
 * Input type for the DeleteComment use case, defining the necessary properties to delete an existing comment. This includes the ID of the comment to be deleted and the ID of the user requesting the deletion.
 */
export interface DeleteCommentUseCaseInput {
    /**
     * The ID of the comment to be deleted
     */
    commentId: string;
    /**
     * The ID of the user requesting the deletion, used to verify permissions and ownership
     */
    userId: string;
}
