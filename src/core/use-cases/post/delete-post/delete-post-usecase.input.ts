/**
 * Input interface for deleting a post.
 *
 * This interface defines the required parameters for deleting a post,
 * including authorization and media cleanup information.
 */
export interface DeletePostUseCaseInput {
    /**
     * The unique identifier of the post to be deleted.
     */
    postId: string;

    /**
     * The unique identifier of the user attempting to delete the post.
     * Used for authorization validation.
     */
    userId: string;

    /**
     * The base URL of the CDN where post media is stored.
     * Used for constructing file paths when cleaning up media files.
     */
    cdnBaseUrl: string;
}
