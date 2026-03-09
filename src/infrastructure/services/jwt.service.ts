import type { FastifyInstance } from "fastify";
import { randomBytes, createHash } from "crypto";
import type {
    AuthTokenPort,
    TokenResult,
    UserPayload,
} from "@core/ports/auth-token.port";

export class JwtService implements AuthTokenPort {
    constructor(
        private readonly fastify: FastifyInstance,
        private readonly expiresInSeconds: number,
        private readonly refreshTokenExpiresInSeconds: number,
    ) {}

    generate(payload: UserPayload): TokenResult {
        const accessToken = this.fastify.jwt.sign(payload);

        const nowInSeconds = Math.floor(Date.now() / 1000);
        const accessTokenExpiresAt = nowInSeconds + this.expiresInSeconds;

        const refreshToken = randomBytes(40).toString("hex");
        const refreshTokenExpiresAt = new Date(
            Date.now() + this.refreshTokenExpiresInSeconds * 1000,
        );

        return {
            accessToken,
            expiresAt: accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
        };
    }
    verify(token: string): UserPayload {
        return this.fastify.jwt.verify(token);
    }

    hashRefreshSecret(secret: string): string {
        return createHash("sha256").update(secret).digest("hex");
    }
}
