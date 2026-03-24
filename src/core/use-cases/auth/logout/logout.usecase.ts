import type { AuthTokenPort } from "@core/ports/services/auth-token.port";
import type { TransactionPort } from "@core/ports/services/transaction.port";
import type { LogoutInput } from "./logout.input";

/**
 * Use case for handling user logout and token revocation.
 *
 * This use case manages the logout process by revoking refresh tokens
 * to prevent further access to protected resources.
 */
export class LogoutUseCase {
    /**
     * Creates a new instance of LogoutUseCase.
     *
     * @param transactionService - Service for managing database transactions
     * @param authTokenService - Service for token operations
     */
    constructor(
        private readonly transactionService: TransactionPort,
        private readonly authTokenService: AuthTokenPort,
    ) {}

    /**
     * Executes the logout process by revoking the provided refresh token.
     *
     * @param input - Logout input containing the refresh token to revoke
     * @returns Promise<void> - Resolves when logout is complete
     *
     * @remarks
     * If no token is provided, the method returns silently.
     * The operation is performed within a database transaction to ensure consistency.
     */
    async execute(input: LogoutInput): Promise<void> {
        if (!input.token) {
            return;
        }

        await this.transactionService.runInTransaction(async (ctx) => {
            const tokenHash = this.authTokenService.hashRefreshSecret(
                input.token,
            );

            const currentToken =
                await ctx.refreshTokenRepository.findByTokenHash(tokenHash);

            if (currentToken && !currentToken.isRevoked) {
                currentToken.revoke();

                await ctx.refreshTokenRepository.update(currentToken);
            }
        });
    }
}
