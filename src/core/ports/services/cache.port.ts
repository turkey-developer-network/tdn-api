/**
 * Port interface for caching operations.
 * Following Clean Architecture principles, this interface defines the contract
 * for caching operations without exposing implementation details.
 */
export interface CachePort {
    /**
     * Retrieves a value from the cache by its key.
     * @param key - The cache key.
     * @returns The cached value if found, otherwise null.
     */
    get(key: string): Promise<string | null>;

    /**
     * Stores a value in the cache with an optional TTL.
     * @param key - The cache key.
     * @param value - The value to store.
     * @param ttlSeconds - Optional time-to-live in seconds.
     */
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;

    /**
     * Deletes cache entries matching a pattern.
     * @param pattern - The pattern to match cache keys against.
     */
    deleteByPattern(pattern: string): Promise<void>;
}
