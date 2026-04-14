import type { IUserRepository } from "@core/ports/repositories/user.repository";
import type { CheckUserUseCaseInput } from "./check-user-usecase.input";

/**
 * Use case for checking whether a user exists by a given identifier
 * Useful for pre-validation steps such as login or registration flows
 */
export class CheckUserUseCase {
    /**
     * @param userRepository - Repository used to look up users
     */
    constructor(private readonly userRepository: IUserRepository) {}

    /**
     * Executes the use case to determine if a user exists
     * @param input - The input containing the identifier to search for
     * @returns True if a matching user is found, false otherwise
     */
    async execute(input: CheckUserUseCaseInput): Promise<boolean> {
        const user = await this.userRepository.findByIdentifier(
            input.identifier,
        );

        return user !== null;
    }
}
