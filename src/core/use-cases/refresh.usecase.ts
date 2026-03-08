import { UnauthorizedError } from "@core/errors/unauthorized.error";
import type { TokenPort, UserPayload } from "@core/ports/token.port";
import type { TransactionPort } from "@core/ports/transaction.port";

export interface RefreshInput {
    token: string;
    deviceIp: string;
    userAgent: string;
}

export interface RefreshOutput {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
    user: UserPayload;
}

export class RefreshUseCase {
    constructor(
        private readonly transactionPort: TransactionPort,
        private readonly tokenService: TokenPort,
    ) {}

    async execute(input: RefreshInput): Promise<RefreshOutput> {
        return await this.transactionPort.runInTransaction(async (ctx) => {
            const currentToken = await ctx.refreshTokenRepository.findByToken(
                input.token,
            );

            if (!currentToken) {
                throw new UnauthorizedError("Session not found");
            }

            if (currentToken.isRevoked) {
                await ctx.refreshTokenRepository.revokeAllByUserId(
                    currentToken.userId,
                );

                throw new UnauthorizedError(
                    "Security alert: Session compromised. All sessions revoked.",
                );
            }

            if (currentToken.isExpired()) {
                throw new UnauthorizedError("Session expired");
            }

            const user = await ctx.userRepository.findById(currentToken.userId);
            if (!user || user.isDeleted()) {
                throw new UnauthorizedError("User account unavailable");
            }

            currentToken.revoke();
            await ctx.refreshTokenRepository.update(currentToken);

            const payload: UserPayload = {
                id: user.id,
                username: user.username,
            };

            const {
                accessToken,
                expiresAt,
                refreshToken,
                refreshTokenExpiresAt,
            } = this.tokenService.generate(payload);

            await ctx.refreshTokenRepository.create({
                token: refreshToken,
                userId: user.id,
                deviceIp: input.deviceIp,
                userAgent: input.userAgent,
                expiresAt: refreshTokenExpiresAt,
            });

            return {
                accessToken,
                expiresAt,
                refreshToken,
                refreshTokenExpiresAt,
                user: payload,
            };
        });
    }
}
