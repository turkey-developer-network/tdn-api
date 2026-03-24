import type { IUserRepository } from "@core/ports/repositories/user.repository";
import type { ChangeUsernameUseCaseInput } from "./change-username-usecase.input";

/**
 * Use case for changing a user's username.
 *
 * This use case handles updating a user's username in the system.
 */
export class ChangeUsernameUseCase {
    /**
     * Creates a new instance of ChangeUsernameUseCase.
     *
     * @param userRepository - Repository for managing user data
     */
    constructor(private readonly userRepository: IUserRepository) {}

    /**
     * Executes the username change process.
     *
     * @param input - Input containing user ID and new username
     * @returns Promise<void> - Resolves when username update is complete
     *
     * @remarks
     * This method updates the user's username in the database.
     * The operation is performed directly on the user repository.
     */
    async execute(input: ChangeUsernameUseCaseInput): Promise<void> {
        await this.userRepository.updateUsername(input.id, input.newUsername);
    }
}
