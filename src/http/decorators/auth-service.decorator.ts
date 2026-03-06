import fastifyPlugin from "fastify-plugin";
import { AuthService } from "../services/auth.service";
import { type FastifyInstance } from "fastify";
import { PrismaUserRepository } from "@infrastructure/repositories/prisma-user.repository";
import { PasswordService } from "@infrastructure/services/password.service";
import { CreateUserUseCase } from "@core/use-cases/create-user.usecase";
import { RegisterUseCase } from "@core/use-cases/register-usecase";

function authServiceDecorator(fastify: FastifyInstance): void {
    const userRepo = new PrismaUserRepository(fastify.prisma);
    const passwordService = new PasswordService();
    const createUserUseCase = new CreateUserUseCase(userRepo);
    const registerUseCase = new RegisterUseCase(
        createUserUseCase,
        passwordService,
    );

    fastify.decorate("authService", new AuthService(registerUseCase));
}

export default fastifyPlugin(authServiceDecorator);
