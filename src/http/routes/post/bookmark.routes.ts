/**
 * Defines bookmark-related routes for the application
 * @param fastify - Fastify instance for route registration
 */
import {
    type SaveBookmarkParams,
    saveBookmarkParamsSchema,
    SaveBookmarkResponseSchema,
} from "@typings/schemas/bookmark/save-bookmark-params.schema";
import { RateLimitPolicies } from "@plugins/rate-limit.plugin";
import type { FastifyInstance } from "fastify";
import {
    type DeleteBookmarkParams,
    deleteBookmarkParamsSchema,
    UnsaveBookmarkResponseSchema,
} from "@typings/schemas/bookmark/delete-bookmark.params.schema";
import {
    type GetBookmarksQuery,
    getBookmarksQuerySchema,
    GetBookmarksResponseSchema,
    type GetBookmarksResponse,
} from "@typings/schemas/bookmark/get-bookmarks-query.schema";

export function bookmarkRoutes(fastify: FastifyInstance): void {
    const { bookmarkController } = fastify.diContainer.cradle;

    /**
     * Creates a bookmark for a post
     * @route POST /:id/save
     * @authentication Required
     * @rateLimit SENSITIVE policy applied
     */
    fastify.post<{ Params: SaveBookmarkParams }>(
        "/:id/save",
        {
            onRequest: [fastify.authenticate],
            schema: {
                params: saveBookmarkParamsSchema,
                response: { 201: SaveBookmarkResponseSchema },
                tags: ["Bookmark"],
            },
            config: { rateLimit: RateLimitPolicies.SENSITIVE },
        },
        bookmarkController.save.bind(bookmarkController),
    );

    /**
     * Removes a bookmark for a post
     * @route DELETE /:id/unsave
     * @authentication Required
     * @rateLimit SENSITIVE policy applied
     */
    fastify.delete<{ Params: DeleteBookmarkParams }>(
        "/:id/unsave",
        {
            onRequest: [fastify.authenticate],
            schema: {
                params: deleteBookmarkParamsSchema,
                response: { 200: UnsaveBookmarkResponseSchema },
                tags: ["Bookmark"],
            },
            config: { rateLimit: RateLimitPolicies.SENSITIVE },
        },
        bookmarkController.unsave.bind(bookmarkController),
    );

    /**
     * Retrieves bookmarks for the authenticated user
     * @route GET /bookmarks
     * @authentication Required
     */
    fastify.get<{
        Querystring: GetBookmarksQuery;
        Reply: { 200: GetBookmarksResponse };
    }>(
        "/bookmarks",
        {
            onRequest: [fastify.authenticate],
            schema: {
                querystring: getBookmarksQuerySchema,
                response: { 200: GetBookmarksResponseSchema },
                tags: ["Bookmark"],
            },
        },
        bookmarkController.getBookmarks.bind(bookmarkController),
    );
}
