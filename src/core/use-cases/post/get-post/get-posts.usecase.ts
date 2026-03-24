import type { IPostRepository } from "@core/ports/repositories/post.repository";
import type { CachePort } from "@core/ports/services/cache.port";
import type { GetPostsInput } from "./get-posts-usecase.input";
import type { GetPostsOutput } from "./get-posts-usecase.output";

/**
 * Use case for retrieving posts with pagination and caching.
 *
 * This use case handles fetching posts from the database with optional
 * type filtering, pagination, and cache optimization.
 */
export class GetPostsUseCase {
    /**
     * Creates a new instance of GetPostsUseCase.
     *
     * @param postRepository - Repository for managing post data
     * @param cacheService - Service for cache operations
     */
    constructor(
        private readonly postRepository: IPostRepository,
        private readonly cacheService: CachePort,
    ) {}

    /**
     * Executes the get posts process with caching.
     *
     * @param request - Input containing pagination and filtering options
     * @returns Promise<GetPostsOutput> Posts with pagination metadata
     *
     * @remarks
     * This method first checks for cached data using a cache key based on
     * pagination and filtering parameters. If cached data exists, it returns
     * that data. Otherwise, it fetches from the database, caches the result
     * for 60 seconds, and returns the data with pagination metadata.
     */
    async execute(request: GetPostsInput): Promise<GetPostsOutput> {
        const page = request.page || 1;
        const limit = request.limit || 10;
        const typeStr = request.type || "ALL";

        const cacheKey = `posts:feed:page:${page}:limit:${limit}:type:${typeStr}`;

        const cachedData = await this.cacheService.get(cacheKey);

        if (cachedData) {
            return JSON.parse(cachedData) as GetPostsOutput;
        }

        const { posts, total } = await this.postRepository.findAll({
            page,
            limit,
            type: request.type,
        });

        const totalPages = Math.ceil(total / limit);

        const response: GetPostsOutput = {
            data: posts,
            meta: { total, page, limit, totalPages },
        };

        await this.cacheService.set(cacheKey, JSON.stringify(response), 60);

        return response;
    }
}
