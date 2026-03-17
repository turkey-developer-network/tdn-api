import type { IUserRepository } from "@core/ports/repositories/user.repository";
import type { ChangeUsernameUseCaseInput } from "./change-username-usecase.input";

export class ChangeUsernameUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(input: ChangeUsernameUseCaseInput): Promise<void> {
        await this.userRepository.updateUsername(input.id, input.newUsername);
    }
}
