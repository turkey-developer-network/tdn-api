import { type IPostRepository } from "@core/ports/repositories/post.repository";
import type { CreatePostInput } from "./create-post-usecase.input";
import type { CachePort } from "@core/ports/services/cache.port";
import { Post } from "@core/domain/entities/post.entity";

/**
 * Use case for creating a new post.
 *
 * This use case handles the process of creating a post with optional media
 * and invalidating related cache entries.
 */
export class CreatePostUseCase {
    /**
     * Creates a new instance of CreatePostUseCase.
     *
     * @param postRepository - Repository for managing post data
     * @param cacheService - Service for cache operations
     */
    constructor(
        private readonly postRepository: IPostRepository,
        private readonly cacheService: CachePort,
    ) {}

    /**
     * Executes the post creation process.
     *
     * @param request - Input containing post content, type, author ID, and media URLs
     * @returns Promise<void> - Resolves when post creation is complete
     *
     * @remarks
     * This method creates a new post entity, saves it to the database,
     * and clears any cached feed data to ensure consistency.
     */
    async execute(request: CreatePostInput): Promise<void> {
        const post = Post.create(
            request.content,
            request.type,
            request.authorId,
            request.mediaUrls || [],
        );

        await this.postRepository.create(post);
        await this.cacheService.deleteByPattern("posts:feed:*");
    }
}
