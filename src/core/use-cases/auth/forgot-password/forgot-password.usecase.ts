import type { IUserRepository } from "@core/ports/repositories/user.repository";
import type { IVerificationTokenRepository } from "@core/ports/repositories/verification-token.repository";
import type { EmailPort } from "@core/ports/services/email.port";
import { TokenType } from "@core/entities/verification-token.entity";
import type { CryptoPort } from "@core/ports/services/crypto.port";
import type { ForgotPasswordInput } from "./forgot-password.input";

export class ForgotPasswordUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly verificationTokenRepository: IVerificationTokenRepository,
        private readonly emailService: EmailPort,
        private readonly cryptoService: CryptoPort,
    ) {}

    async execute(input: ForgotPasswordInput): Promise<void> {
        const user = await this.userRepository.findByEmail(input.email);

        if (
            !user ||
            user.isDeleted() ||
            !user.isEmailVerified ||
            !user.passwordHash
        ) {
            return;
        }

        const otp = this.cryptoService.generateOtp(8);
        const tokenHash = this.cryptoService.hashOtp(otp);
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

        await this.emailService.sendPasswordResetEmail({
            to: user.email,
            otp,
        });
    }
}
