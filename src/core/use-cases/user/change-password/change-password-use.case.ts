import { BadRequestError } from "@core/errors";
import type { IUserRepository } from "@core/ports/repositories/user.repository";
import type { PasswordPort } from "@core/ports/services/password.port";
import type { ChangePasswordUseCaseInput } from "./change-password-usecase.input";

/**
 * Use case for changing a user's password.
 *
 * This use case handles validating the current password and updating it with
 * a new password, including validation to ensure the new password is different.
 */
export class ChangePasswordUseCase {
    /**
     * Creates a new instance of ChangePasswordUseCase.
     *
     * @param userRepository - Repository for managing user data
     * @param passwordService - Service for password hashing and verification
     */
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: PasswordPort,
    ) {}

    /**
     * Executes the password change process.
     *
     * @param input - Input containing user ID, current password, and new password
     * @returns Promise<void> - Resolves when password change is complete
     *
     * @throws BadRequestError - When current password is invalid or new password is same as current
     *
     * @remarks
     * This method validates the current password, ensures the new password is
     * different from the current one, and updates the user's password in the database.
     * For users with social provider accounts (no password), it suggests using
     * the password reset flow instead.
     */
    async execute(input: ChangePasswordUseCaseInput): Promise<void> {
        const { id, currentPassword, newPassword } = input;

        const dbHashedPassword = await this.userRepository.findPasswordById(id);

        if (!dbHashedPassword) {
            throw new BadRequestError(
                "This account is linked to a social provider. Please use the password reset flow to set a new password.",
            );
        }

        const isCurrentPasswordValid = await this.passwordService.verify(
            currentPassword,
            dbHashedPassword,
        );

        if (!isCurrentPasswordValid)
            throw new BadRequestError("Invalid current password provided.");

        if (currentPassword === newPassword) {
            throw new BadRequestError(
                "New password must be different from the current one.",
            );
        }

        const hashedNewPassword = await this.passwordService.hash(newPassword);

        await this.userRepository.updatePassword(id, hashedNewPassword);
    }
}
