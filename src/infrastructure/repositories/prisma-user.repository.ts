import type { User } from "@core/entities/user.entity";
import type { IUserRepository } from "@core/repositories/user.repository";
import UserPrismaMapper from "../mappers/user-prisma.mapper";
import { UserAlreadyExistsError } from "@core/errors";
import { PrismaClientKnownRequestError } from "@generated/prisma/internal/prismaNamespace";
import type { PrismaTransactionalClient } from "@infrastructure/database/prisma-client.type";

export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaTransactionalClient) {}

    async create(data: {
        email: string;
        username: string;
        passwordHash: string | null;
    }): Promise<User> {
        try {
            const user = await this.prisma.user.create({
                data: UserPrismaMapper.toPrismaCreateUser(data),
            });

            return UserPrismaMapper.toDomainUser(user);
        } catch (error: unknown) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") throw new UserAlreadyExistsError();
            }

            throw error;
        }
    }

    async findByIdentifier(identifier: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { username: identifier }],
            },
        });

        if (!user) return null;

        return UserPrismaMapper.toDomainUser(user);
    }

    async findById(id: string): Promise<User | null> {
        const rawUser = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!rawUser) return null;

        return UserPrismaMapper.toDomainUser(rawUser);
    }
}
