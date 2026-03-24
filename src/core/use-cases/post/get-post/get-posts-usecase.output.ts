import type { PostType } from "@core/domain/enums/post-type.enum";

/**
 * Output interface for retrieving posts.
 *
 * This interface defines the structure of the data returned when fetching
 * posts with pagination support.
 */
export interface GetPostsOutput {
    /**
     * Array of post entities matching the query criteria.
     */
    posts: PostOutput[];

    /**
     * Total number of posts matching the query criteria.
     */
    total: number;
}

/**
 * Output interface for a single post entity.
 */
export interface PostOutput {
    /**
     * Unique identifier for the post.
     */
    id: string;

    /**
     * Content of the post.
     */
    content: string;

    /**
     * Type of the post.
     */
    type: PostType;

    /**
     * URLs of media files associated with the post.
     */
    mediaUrls: string[];

    /**
     * Author of the post.
     */
    author: {
        /**
         * Unique identifier for the author.
         */
        id: string;

        /**
         * Username of the author.
         */
        username: string;

        /**
         * URL of the author's avatar.
         */
        avatarUrl: string;
    };

    /**
     * Date and time when the post was created.
     */
    createdAt: Date;

    /**
     * Date and time when the post was last updated.
     */
    updatedAt: Date;
}
