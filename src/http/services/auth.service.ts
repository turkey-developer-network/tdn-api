import { type FastifyInstance } from "fastify";
import { PrismaUserRepository } from "src/infrastructure/repositories/prisma-user.repository";
import type { User } from "src/core/entities/user.entity";
import { RegisterUseCase } from "src/core/use-cases/register-usecase";
import { CreateUserUseCase } from "src/core/use-cases/create-user.usecase";
import { PasswordService } from "src/infrastructure/services/password.service";

export class AuthService {
    private readonly registerUseCase: RegisterUseCase;
    constructor(private readonly prisma: FastifyInstance["prisma"]) {
        const userRepo = new PrismaUserRepository(prisma);
        const createUser = new CreateUserUseCase(userRepo);
        const password = new PasswordService();
        this.registerUseCase = new RegisterUseCase(createUser, password);
    }

    async register(body: {
        email: string;
        username: string;
        password: string;
    }): Promise<User> {
        return this.registerUseCase.execute(body);
    }
}
