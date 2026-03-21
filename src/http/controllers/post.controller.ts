import type { CreatePostUseCase } from "@core/use-cases/post/create-post/create-post.usecase";
import type { CreatePostBody } from "@typings/schemas/post/create-post.schema";
import type { FastifyReply, FastifyRequest } from "fastify";

export default class PostController {
    constructor(private readonly createPostUseCase: CreatePostUseCase) {}

    async create(
        request: FastifyRequest<{ Body: CreatePostBody }>,
        reply: FastifyReply,
    ): Promise<void> {
        const authorId = request.user.id;
        const { content, type, mediaUrls } = request.body;

        await this.createPostUseCase.execute({
            authorId,
            content,
            type,
            mediaUrls,
        });

        return reply.status(201).send({
            meta: {
                timestamp: new Date().toISOString(),
            },
        });
    }
}
