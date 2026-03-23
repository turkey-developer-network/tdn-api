import { UnauthorizedError } from "@core/errors";
import type { EmailPort } from "@core/ports/services/email.port";
import type { IUserRepository } from "@core/ports/repositories/user.repository";
import { TokenType } from "@core/entities/verification-token.entity";
import type { IVerificationTokenRepository } from "@core/ports/repositories/verification-token.repository";
import type { CryptoPort } from "@core/ports/services/crypto.port";
import type { SendVerificationEmailInput } from "./send-verification-email.input";

export class SendVerificationEmailUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly verificationTokenRepository: IVerificationTokenRepository,
        private readonly emailService: EmailPort,
        private readonly cryptoService: CryptoPort,
    ) {}

    async execute(input: SendVerificationEmailInput): Promise<void> {
        const user = await this.userRepository.findById(input.userId);

        if (!user || user.isDeleted()) {
            throw new UnauthorizedError("User not found");
        }

        if (user.isEmailVerified) {
            return;
        }

        const plainOtp = this.cryptoService.generateOtp(8);

        const hashedOtp = this.cryptoService.hashOtp(plainOtp);

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await this.verificationTokenRepository.upsert({
            userId: user.id,
            tokenHash: hashedOtp,
            type: TokenType.EMAIL_VERIFICATION,
            expiresAt,
        });

        await this.emailService.sendVerificationEmail({
            to: user.email,
            otp: plainOtp,
        });
    }
}
