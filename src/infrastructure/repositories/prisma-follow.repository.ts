import type { PrismaClient } from "@generated/prisma/client";
import type { IFollowRepository } from "@core/ports/repositories/follow.repository";

export class PrismaFollowUserRepository implements IFollowRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async checkIsFollowing(
        followerId: string,
        followingId: string,
    ): Promise<boolean> {
        const follow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
        return follow !== null;
    }

    async followUser(followerId: string, followingId: string): Promise<void> {
        await this.prisma.follow.create({
            data: {
                followerId,
                followingId,
            },
        });
    }

    async unfollowUser(followerId: string, followingId: string): Promise<void> {
        await this.prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
    }
}
