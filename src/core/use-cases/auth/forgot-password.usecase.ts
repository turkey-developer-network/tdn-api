import type { IUserRepository } from "@core/repositories/user.repository";
import type { IVerificationTokenRepository } from "@core/repositories/verification-token.repository";
import type { TokenPort } from "@core/ports/token.port";
import type { EmailPort } from "@core/ports/email.port";
import { TokenType } from "@core/entities/verification-token.entity";

export interface ForgotPasswordInput {
    email: string;
}

export class ForgotPasswordUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly verificationTokenRepository: IVerificationTokenRepository,
        private readonly tokenPort: TokenPort,
        private readonly emailPort: EmailPort,
    ) {}

    async execute(input: ForgotPasswordInput): Promise<void> {
        const user = await this.userRepository.findByEmail(input.email);

        if (!user || user.isDeleted()) {
            return;
        }

        const otp = this.tokenPort.generateOtp(8);
        const tokenHash = this.tokenPort.hashOtp(otp);
        /**
         * It can then be done from the .env file.
         */
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await this.verificationTokenRepository.upsert({
            userId: user.id,
            tokenHash,
            type: TokenType.PASSWORD_RESET,
            expiresAt,
        });

        await this.emailPort.sendPasswordResetEmail({
            to: user.email,
            otp,
        });
    }
}
