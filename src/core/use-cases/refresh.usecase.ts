import { UnauthorizedError } from "@core/errors/unauthorized.error";
import type { TokenPort, UserPayload } from "@core/ports/token.port";
import type { IRefreshTokenRepository } from "@core/repositories/refresh-token.repository";
import type { IUserRepository } from "@core/repositories/user.repository";

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
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly userRepository: IUserRepository,
        private readonly tokenService: TokenPort,
    ) {}

    async execute(input: RefreshInput): Promise<RefreshOutput> {
        const currentToken = await this.refreshTokenRepository.findByToken(
            input.token,
        );

        if (!currentToken || !currentToken.isValid()) {
            throw new UnauthorizedError("Session is no longer valid");
        }

        const user = await this.userRepository.findById(currentToken.userId);

        if (!user || user.isDeleted()) {
            throw new UnauthorizedError("User account unavailable");
        }

        currentToken.revoke();
        await this.refreshTokenRepository.update(currentToken);

        const payload: UserPayload = {
            id: user.id,
            username: user.username,
        };

        const { accessToken, expiresAt, refreshToken, refreshTokenExpiresAt } =
            this.tokenService.generate(payload);

        await this.refreshTokenRepository.create({
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
    }
}
