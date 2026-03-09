import { UnauthorizedError } from "@core/errors/unauthorized.error";
import type { EmailPort } from "@core/ports/email.port";
import type { TokenPort } from "@core/ports/token.port";
import type { IUserRepository } from "@core/repositories/user.repository";
import { TokenType } from "@core/entities/verification-token.entity";
import type { IVerificationTokenRepository } from "@core/repositories/verification-token.repository";

export interface SendVerificationEmailInput {
    userId: string;
}

export class SendVerificationEmailUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly verificationTokenRepository: IVerificationTokenRepository,
        private readonly tokenPort: TokenPort,
        private readonly emailPort: EmailPort,
    ) {}

    async execute(input: SendVerificationEmailInput): Promise<void> {
        const user = await this.userRepository.findById(input.userId);

        if (!user || user.isDeleted()) {
            throw new UnauthorizedError("User not found");
        }

        if (user.isEmailVerified) {
            return;
        }

        const plainOtp = this.tokenPort.generateOtp(8);

        const hashedOtp = this.tokenPort.hashOtp(plainOtp);

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await this.verificationTokenRepository.upsert({
            userId: user.id,
            tokenHash: hashedOtp,
            type: TokenType.EMAIL_VERIFICATION,
            expiresAt,
        });

        await this.emailPort.sendVerificationEmail({
            to: user.email,
            otp: plainOtp,
        });
    }
}
