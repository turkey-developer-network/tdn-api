import type { TokenType } from "@core/domain/enums/token-type.enum";

export class VerificationToken {
    constructor(
        public readonly id: string,
        public readonly tokenHash: string,
        public readonly userId: string,
        public readonly type: TokenType,
        public readonly expiresAt: Date,
        public readonly createdAt: Date,
    ) {}

    isExpired(): boolean {
        return new Date() > this.expiresAt;
    }
}
