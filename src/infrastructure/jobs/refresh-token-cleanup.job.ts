import type { CleanupRefreshTokensUseCase } from "@core/use-cases/auth/cleanup-refresh-tokens/cleanup-refresh-tokens.usecase";

export interface RefreshTokenCleanupJobInput {
    gracePeriodHours: number;
}

export class RefreshTokenCleanupJob {
    constructor(
        private readonly cleanupRefreshTokensUseCase: CleanupRefreshTokensUseCase,
    ) {}

    async run(input: RefreshTokenCleanupJobInput): Promise<number> {
        return this.cleanupRefreshTokensUseCase.execute({
            gracePeriodHours: input.gracePeriodHours,
        });
    }
}
