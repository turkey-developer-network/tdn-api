import type { Post } from "@core/domain/entities/post.entity";

/**
 * Output interface for retrieving posts with pagination and metadata.
 *
 * This interface defines the structure of the data returned when fetching
 * posts with pagination support, including the posts themselves and
 * pagination metadata.
 */
export interface GetPostsOutput {
    /**
     * Array of post entities matching the query criteria.
     */
    data: Post[];

    /**
     * Metadata about the pagination and total results.
     */
    meta: {
        /**
         * Total number of posts matching the query criteria.
         */
        total: number;

        /**
         * Current page number (1-based).
         */
        page: number;

        /**
         * Number of posts per page.
         */
        limit: number;

        /**
         * Total number of pages available.
         */
        totalPages: number;
    };
}
