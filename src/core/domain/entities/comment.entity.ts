/**
 * Comment entity representing a user comment on a post
 * Supports nested comments through optional parent-child relationships
 */
import type { CommentProps } from "@core/domain/interfaces/comment-props.interface";

export class Comment {
    /**
     * Private constructor to enforce creation through factory methods
     * @param props - Comment properties
     */
    private constructor(private readonly props: CommentProps) {}

    /**
     * Gets the unique identifier of the comment
     * @returns The comment ID
     */
    public get id(): string {
        return this.props.id!;
    }

    /**
     * Gets the content of the comment
     * @returns The comment text content
     */
    public get content(): string {
        return this.props.content;
    }

    /**
     * Gets the media URLs attached to the comment
     * @returns Array of media URL strings, or an empty array if none exist
     */
    public get mediaUrls(): string[] {
        return this.props.mediaUrls || [];
    }

    /**
     * Gets the ID of the post this comment belongs to
     * @returns The post ID
     */
    public get postId(): string {
        return this.props.postId;
    }

    /**
     * Gets the ID of the user who authored this comment
     * @returns The author user ID
     */
    public get authorId(): string {
        return this.props.authorId;
    }

    /**
     * Gets the ID of the parent comment if this is a nested comment
     * @returns Parent comment ID or null if this is a top-level comment
     */
    public get parentId(): string | null {
        return this.props.parentId;
    }

    /**
     * Gets the creation timestamp of the comment
     * @returns The creation date
     */
    public get createdAt(): Date {
        return this.props.createdAt!;
    }

    /**
     * Gets the last update timestamp of the comment
     * @returns The last update date
     */
    public get updatedAt(): Date {
        return this.props.updatedAt!;
    }

    /**
     * Factory method to create a new comment
     * @param content - The text content of the comment
     * @param postId - The ID of the post this comment belongs to
     * @param authorId - The ID of the user who authored this comment
     * @param parentId - Optional parent comment ID for nested comments
     * @param mediaUrls - Optional array of media URLs attached to the comment
     * @returns A new Comment instance
     */
    public static create(
        content: string,
        postId: string,
        authorId: string,
        parentId: string | null = null,
        mediaUrls: string[] = [],
    ): Comment {
        return new Comment({
            content,
            postId,
            authorId,
            parentId,
            mediaUrls,
        });
    }

    /**
     * Gets the author details of the comment
     * @returns An object containing the author's id and optional profile fields,
     *          or undefined if author data is not populated
     */
    public get author():
        | {
              id: string;
              username?: string;
              avatarUrl?: string;
              fullName?: string;
          }
        | undefined {
        return this.props.author;
    }

    /**
     * Gets the total number of likes on the comment
     * @returns The like count, or 0 if not set
     */
    public get likeCount(): number {
        return this.props.likeCount || 0;
    }

    /**
     * Gets the total number of replies to the comment
     * @returns The reply count, or 0 if not set
     */
    public get replyCount(): number {
        return this.props.replyCount || 0;
    }

    /**
     * Indicates whether the current user has liked the comment
     * @returns True if the comment is liked by the current user, false otherwise
     */
    public get isLiked(): boolean {
        return this.props.isLiked || false;
    }

    /**
     * Indicates whether the current user has bookmarked the comment
     * @returns True if the comment is bookmarked by the current user, false otherwise
     */
    public get isBookmarked(): boolean {
        return this.props.isBookmarked || false;
    }

    /**
     * Factory method to create a comment from existing properties
     * @param props - Comment properties including optional ID and timestamps
     * @returns A Comment instance with the provided properties
     */
    public static with(props: CommentProps): Comment {
        return new Comment(props);
    }
}
