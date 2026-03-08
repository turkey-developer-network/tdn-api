import type { IRefreshTokenRepository } from "@core/repositories/refresh-token.repository";
import type { IUserRepository } from "@core/repositories/user.repository";

export interface TransactionContext {
    readonly userRepository: IUserRepository;
    readonly refreshTokenRepository: IRefreshTokenRepository;
}

export interface TransactionPort {
    runInTransaction<T>(
        work: (ctx: TransactionContext) => Promise<T>,
    ): Promise<T>;
}
