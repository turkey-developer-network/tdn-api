import type { IPostRepository } from "@core/ports/repositories/post.repository";
import type { Post } from "@core/domain/entities/post.entity";
import type { GetUserPostsInput } from "@core/use-cases/post/get-user-posts/get-user-posts-usecase.input";

export class GetUserPostsUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(
        input: GetUserPostsInput,
    ): Promise<{ posts: Post[]; total: number }> {
        return await this.postRepository.findByAuthorUsername(
            input.username,
            input.page,
            input.limit,
            input.type,
        );
    }
}
