import type { PrismaClient } from "@generated/prisma/client";
import type { User } from "@core/entities/user.entity";
import type { IUserRepository } from "@core/repositories/user.repository";
import UserPrismaMapper from "../mappers/user-prisma.mapper";

export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(data: {
        email: string;
        username: string;
        passwordHash: string | null;
    }): Promise<User> {
        const user = await this.prisma.user.create({
            data: UserPrismaMapper.toPrismaCreateUser(data),
        });

        return UserPrismaMapper.toDomainUser(user);
    }
}
