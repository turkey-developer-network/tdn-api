import type { GetUserPostsUseCase } from "@core/use-cases/post/get-user-posts/get-user.posts.usecase";
import type { ChangeEmailUseCase } from "@core/use-cases/user/change-email";
import type { ChangePasswordUseCase } from "@core/use-cases/user/change-password";
import type { ChangeUsernameUseCase } from "@core/use-cases/user/change-username";
import type { GetMeUserUseCase } from "@core/use-cases/user/get-me";
import type { SoftDeleteUserUseCase } from "@core/use-cases/user/soft-delete";
import { PostPrismaMapper } from "@infrastructure/persistence/mappers/post-prisma.mapper";
import type {
    GetUserPostsParams,
    GetUserPostsQuery,
} from "@typings/schemas/post/get-user-posts.schema";
import type { ChangeEmailBody } from "@typings/schemas/user/change-email.schema";
import type { ChangePasswordBody } from "@typings/schemas/user/change-password.schema";
import type { ChangeUsernameBody } from "@typings/schemas/user/change-username.schema";
import type { SoftDeleteUserBody } from "@typings/schemas/user/solft-delete.schema";
import type { FastifyReply, FastifyRequest } from "fastify";

export class UserController {
    constructor(
        private readonly softDeleteUserUseCase: SoftDeleteUserUseCase,
        private readonly getMeUserUseCase: GetMeUserUseCase,
        private readonly changePasswordUseCase: ChangePasswordUseCase,
        private readonly changeUsernameUseCase: ChangeUsernameUseCase,
        private readonly changeEmailUseCase: ChangeEmailUseCase,
        private readonly getUserPostsUseCase: GetUserPostsUseCase,
    ) {}

    async softDeleteMe(
        request: FastifyRequest<{ Body: SoftDeleteUserBody }>,
        reply: FastifyReply,
    ): Promise<void> {
        const id = request.user.id;
        const { password } = request.body;

        await this.softDeleteUserUseCase.execute({
            id,
            password,
        });

        reply.status(204).send();
    }

    async getMe(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const result = await this.getMeUserUseCase.execute({
            id: request.user.id,
        });

        reply.status(200).send(result);
    }

    async changePasswordMe(
        request: FastifyRequest<{ Body: ChangePasswordBody }>,
        reply: FastifyReply,
    ): Promise<void> {
        const { currentPassword, newPassword } = request.body;

        await this.changePasswordUseCase.execute({
            id: request.user.id,
            currentPassword,
            newPassword,
        });

        reply.status(204).send();
    }

    async changeUsernameMe(
        request: FastifyRequest<{ Body: ChangeUsernameBody }>,
        reply: FastifyReply,
    ): Promise<void> {
        const userId = request.user.id;

        await this.changeUsernameUseCase.execute({
            id: userId,
            newUsername: request.body.newUsername,
        });

        return reply.status(204).send();
    }

    async changeEmailMe(
        request: FastifyRequest<{ Body: ChangeEmailBody }>,
        reply: FastifyReply,
    ): Promise<void> {
        const userId = request.user.id;

        await this.changeEmailUseCase.execute({
            id: userId,
            newEmail: request.body.newEmail,
        });

        return reply.status(204).send();
    }

    async getUserPosts(
        request: FastifyRequest<{
            Params: GetUserPostsParams;
            Querystring: GetUserPostsQuery;
        }>,
        reply: FastifyReply,
    ): Promise<void> {
        const { username } = request.params;
        const { page = 1, limit = 10, type } = request.query;

        const cdnUrl = request.server.config.R2_PUBLIC_URL;

        const result = await this.getUserPostsUseCase.execute({
            username,
            page,
            limit,
            type,
        });

        const formattedData = PostPrismaMapper.toFeedResponse(
            result.posts,
            cdnUrl,
        );

        const totalPages = Math.ceil(result.total / limit);

        return reply.status(200).send({
            data: formattedData,
            meta: {
                total: result.total,
                currentPage: page,
                limit,
                totalPages,
                timestamp: new Date().toISOString(),
            },
        });
    }
}
