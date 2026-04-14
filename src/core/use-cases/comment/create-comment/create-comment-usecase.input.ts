/**
 * Input type for the CreateComment use case, defining the necessary properties to create a new comment. This includes the content of the comment, the ID of the post it belongs to, the ID of the author creating the comment, an optional parent ID for nested comments, and an optional array of media URLs associated with the comment.
 */
export interface CreateCommentUseCaseInput {
    /**
     * The textual content of the comment being created
     */
    content: string;
    /**
     * The ID of the post to which the comment belongs, used to associate the comment with the correct post in the system
     */
    postId: string;
    /**
     * The ID of the user who is creating the comment, used to identify the author of the comment in the system
     */
    authorId: string;
    /**
     * Optional ID of the parent comment if this comment is a reply to another comment, allowing for nested comment structures. If not provided, the comment will be treated as a top-level comment on the post.
     */
    parentId?: string;
    /**
     * Optional array of media URLs associated with the comment, allowing users to attach images, videos, or other media to their comments. This can enhance the expressiveness of the comment and provide additional context or information related to the comment's content.
     */
    mediaUrls?: string[];
}
