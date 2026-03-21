import { type IPostRepository } from "@core/ports/repositories/post.repository";
import type { CreatePostInput } from "./create-post-usecase.input";

export class CreatePostUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(request: CreatePostInput): Promise<void> {
        await this.postRepository.create({
            content: request.content,
            type: request.type,
            mediaUrls: request.mediaUrls,
            authorId: request.authorId,
        });
    }
}
