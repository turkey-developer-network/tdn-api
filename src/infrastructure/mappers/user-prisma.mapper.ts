import type { Prisma, User as PrismaUser } from "@generated/prisma/client";
import { User } from "src/core/entities/user.entity";

export default class UserPrismaMapper {
    /**
     * Prisma record → Domain entity
     */

    static toDomainUser(dbUser: PrismaUser): User {
        return new User({
            id: dbUser.id,
            email: dbUser.email,
            username: dbUser.username,
            passwordHash: dbUser.password,
            deletedAt: dbUser.deletedAt,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
        });
    }
    /**
     * Prisma record → Domain entity
     */

    static toPrismaCreateUser(input: {
        email: string;
        username: string;
        passwordHash: string | null;
    }): Prisma.UserCreateInput {
        return {
            email: input.email,
            username: input.username,
            password: input.passwordHash,
        };
    }
}
