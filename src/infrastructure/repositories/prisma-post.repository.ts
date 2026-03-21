import type {
    PrismaClient,
    PostType as PrismaPostType,
} from "@generated/prisma/client";
import type {
    IPostRepository,
    CreatePostInput,
} from "@core/ports/repositories/post.repository";

export class PrismaPostRepository implements IPostRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(data: CreatePostInput): Promise<void> {
        const hashtagRegex = /#[\p{L}\p{N}_]+/gu;
        const matches = data.content.match(hashtagRegex) || [];
        const uniqueTags = [
            ...new Set(matches.map((tag) => tag.slice(1).toLowerCase())),
        ];

        await this.prisma.post.create({
            data: {
                content: data.content,
                type: data.type as PrismaPostType,
                mediaUrls: data.mediaUrls || [],
                authorId: data.authorId,
                tags: {
                    connectOrCreate: uniqueTags.map((tag) => ({
                        where: { name: tag },
                        create: { name: tag },
                    })),
                },
            },
        });
    }
}
