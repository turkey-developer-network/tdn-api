/**
 * Repository interface for managing OAuth account associations.
 * Following Clean Architecture principles, this interface defines the contract
 * for persisting and retrieving OAuth account data without exposing
 * implementation details or DTOs.
 */
export interface IOAuthAccountRepository {
    /**
     * Retrieves a list of OAuth providers associated with a specific user.
     * @param userId - The unique identifier of the user.
     * @returns An array of provider names (e.g., ["github", "google"]).
     */
    findProvidersByUserId(userId: string): Promise<string[]>;
}
