import type { IRefreshTokenRepository } from "@core/ports/repositories/refresh-token.repository";
import type { IUserRepository } from "@core/ports/repositories/user.repository";

/**
 * Provides transactional access to repositories within a single atomic operation.
 */
export interface TransactionContext {
    /** Repository for user-related data operations within the transaction. */
    readonly userRepository: IUserRepository;

    /** Repository for refresh token-related data operations within the transaction. */
    readonly refreshTokenRepository: IRefreshTokenRepository;
}

/**
 * Port interface for executing operations within a database transaction.
 */
export interface TransactionPort {
    /**
     * Executes a unit of work within a single atomic transaction.
     * If the work throws, the transaction is rolled back.
     *
     * @param work - A callback receiving the transactional context with scoped repositories.
     * @returns A promise that resolves to the return value of the work callback.
     */
    runInTransaction<T>(
        work: (ctx: TransactionContext) => Promise<T>,
    ): Promise<T>;
}
