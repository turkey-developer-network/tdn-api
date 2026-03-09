import { BadRequestError } from "@core/errors/bad-request.error";
import { UnauthorizedError } from "@core/errors/unauthorized.error";
import type { IUserRepository } from "@core/repositories/user.repository";
import type { IVerificationTokenRepository } from "@core/repositories/verification-token.repository";
import type { TokenPort } from "@core/ports/token.port";
import { TokenType } from "@core/entities/verification-token.entity";

export interface VerifyEmailInput {
    userId: string;
    otp: string;
}

export class VerifyEmailUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly verificationTokenRepository: IVerificationTokenRepository,
        private readonly tokenPort: TokenPort,
    ) {}

    async execute(input: VerifyEmailInput): Promise<void> {
        const user = await this.userRepository.findById(input.userId);

        if (!user || user.isDeleted()) {
            throw new UnauthorizedError("Unauthorized access.");
        }

        if (user.isEmailVerified) {
            return;
        }

        const verificationToken =
            await this.verificationTokenRepository.findByUserIdAndType(
                user.id,
                TokenType.EMAIL_VERIFICATION,
            );

        if (!verificationToken) {
            throw new BadRequestError("Invalid verification code.");
        }

        if (verificationToken.isExpired()) {
            throw new BadRequestError(
                "Verification code has expired. Please request a new one.",
            );
        }

        const hashedInputOtp = this.tokenPort.hashOtp(input.otp);
        if (hashedInputOtp !== verificationToken.tokenHash) {
            throw new BadRequestError("Invalid verification code.");
        }

        user.verifyEmail();

        await this.userRepository.update(user);

        await this.verificationTokenRepository.delete(verificationToken.id);
    }
}
