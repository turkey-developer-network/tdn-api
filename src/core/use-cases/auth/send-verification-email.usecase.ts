import { UnauthorizedError } from "@core/errors/unauthorized.error";
import type { EmailPort } from "@core/ports/email.port";
import type { AuthTokenPort } from "@core/ports/auth-token.port";
import type { IUserRepository } from "@core/repositories/user.repository";
import { TokenType } from "@core/entities/verification-token.entity";
import type { IVerificationTokenRepository } from "@core/repositories/verification-token.repository";
import type { OtpPort } from "@core/ports/otp.port";

export interface SendVerificationEmailInput {
    userId: string;
}

export class SendVerificationEmailUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly verificationTokenRepository: IVerificationTokenRepository,
        private readonly tokenPort: AuthTokenPort,
        private readonly emailPort: EmailPort,
        private readonly otpPort: OtpPort,
    ) {}

    async execute(input: SendVerificationEmailInput): Promise<void> {
        const user = await this.userRepository.findById(input.userId);

        if (!user || user.isDeleted()) {
            throw new UnauthorizedError("User not found");
        }

        if (user.isEmailVerified) {
            return;
        }

        const plainOtp = this.otpPort.generateOtp(8);

        const hashedOtp = this.otpPort.hashOtp(plainOtp);

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
