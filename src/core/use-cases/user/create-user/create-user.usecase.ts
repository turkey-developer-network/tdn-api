import type { User } from "@core/domain/entities/user.entity";
import type { IUserRepository } from "@core/ports/repositories/user.repository";

/**
 * Use case for creating a new user.
 *
 * This use case handles the process of creating a new user account with
 * email, username, and optional password hash.
 */
export class CreateUserUseCase {
    /**
     * Creates a new instance of CreateUserUseCase.
     *
     * @param userRepository - Repository for managing user data
     */
    constructor(private readonly userRepository: IUserRepository) {}

    /**
     * Executes the user creation process.
     *
     * @param input - Input containing email, username, and optional password hash
     * @returns Promise<User> The created user entity
     *
     * @remarks
     * This method creates a new user in the database with the provided
     * information. The password hash can be null for OAuth users.
     */
    async execute(input: {
        email: string;
        username: string;
        passwordHash: string | null;
    }): Promise<User> {
        return this.userRepository.create(input);
    }
}
