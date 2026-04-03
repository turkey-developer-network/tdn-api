import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { server, API_PREFIX } from "./setup";

describe("E2E Comment Bookmark & Optional Auth Flow", () => {
    let accessToken: string = "";
    let postId: string = "";
    let commentId: string = "";

    const testUser = {
        email: "comment.bookmark.tester@tdn.com",
        username: "comment_bm_tester",
        password: "SecurePass123!",
    };

    beforeAll(async () => {
        await server.prisma.user.deleteMany({
            where: { username: testUser.username },
        });

        await server.inject({
            method: "POST",
            url: `${API_PREFIX}/auth/register`,
            payload: testUser,
        });

        const loginRes = await server.inject({
            method: "POST",
            url: `${API_PREFIX}/auth/login`,
            payload: {
                identifier: testUser.email,
                password: testUser.password,
            },
        });

        const body = JSON.parse(loginRes.payload);
        accessToken = body.data?.accessToken ?? body.accessToken;

        const postRes = await server.inject({
            method: "POST",
            url: `${API_PREFIX}/posts`,
            headers: { authorization: `Bearer ${accessToken}` },
            payload: { content: "Comment bookmark test post" },
        });
        postId = JSON.parse(postRes.payload).data?.id;

        const commentRes = await server.inject({
            method: "POST",
            url: `${API_PREFIX}/posts/${postId}/comments`,
            headers: { authorization: `Bearer ${accessToken}` },
            payload: { content: "Comment to be bookmarked" },
        });
        commentId = JSON.parse(commentRes.payload).data?.id;
    });

    afterAll(async () => {
        await server.prisma.user.deleteMany({
            where: { username: testUser.username },
        });
    });

    // ─── Optional Auth ──────────────────────────────────────────────────────────

    describe("Optional Auth on GET /posts/:postId/comments", () => {
        it("1. Should return 200 with isLiked/isBookmarked=false for anonymous request", async () => {
            const res = await server.inject({
                method: "GET",
                url: `${API_PREFIX}/posts/${postId}/comments`,
            });

            expect(res.statusCode).toBe(200);
            const body = JSON.parse(res.payload);
            expect(Array.isArray(body.data)).toBe(true);

            const comment = body.data.find(
                (c: { id: string }) => c.id === commentId,
            );
            expect(comment).toBeDefined();
            expect(comment.isLiked).toBe(false);
            expect(comment.isBookmarked).toBe(false);
        });

        it("2. Should return 401 when an invalid token is sent", async () => {
            const res = await server.inject({
                method: "GET",
                url: `${API_PREFIX}/posts/${postId}/comments`,
                headers: { authorization: "Bearer invalid.token.here" },
            });

            expect(res.statusCode).toBe(401);
        });

        it("3. Should populate isLiked/isBookmarked for authenticated request before any interaction", async () => {
            const res = await server.inject({
                method: "GET",
                url: `${API_PREFIX}/posts/${postId}/comments`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            expect(res.statusCode).toBe(200);
            const body = JSON.parse(res.payload);
            const comment = body.data.find(
                (c: { id: string }) => c.id === commentId,
            );
            expect(comment).toBeDefined();
            expect(comment.isLiked).toBe(false);
            expect(comment.isBookmarked).toBe(false);
        });
    });

    // ─── Comment Bookmark CRUD ──────────────────────────────────────────────────

    describe("Comment Bookmark Save / Unsave", () => {
        it("4. Should return 401 when saving a bookmark without auth", async () => {
            const res = await server.inject({
                method: "POST",
                url: `${API_PREFIX}/comments/${commentId}/save`,
            });

            expect(res.statusCode).toBe(401);
        });

        it("5. Should save a comment bookmark (201)", async () => {
            const res = await server.inject({
                method: "POST",
                url: `${API_PREFIX}/comments/${commentId}/save`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            expect(res.statusCode).toBe(201);
        });

        it("6. isBookmarked should be true after saving", async () => {
            const res = await server.inject({
                method: "GET",
                url: `${API_PREFIX}/posts/${postId}/comments`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            const body = JSON.parse(res.payload);
            const comment = body.data.find(
                (c: { id: string }) => c.id === commentId,
            );
            expect(comment).toBeDefined();
            expect(comment.isBookmarked).toBe(true);
        });

        it("7. Saving the same comment twice should be idempotent (no error)", async () => {
            const res = await server.inject({
                method: "POST",
                url: `${API_PREFIX}/comments/${commentId}/save`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            expect(res.statusCode).toBe(201);
        });

        it("8. Should unsave a comment bookmark (200)", async () => {
            const res = await server.inject({
                method: "DELETE",
                url: `${API_PREFIX}/comments/${commentId}/unsave`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            expect(res.statusCode).toBe(200);
        });

        it("9. isBookmarked should be false after unsaving", async () => {
            const res = await server.inject({
                method: "GET",
                url: `${API_PREFIX}/posts/${postId}/comments`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            const body = JSON.parse(res.payload);
            const comment = body.data.find(
                (c: { id: string }) => c.id === commentId,
            );
            expect(comment).toBeDefined();
            expect(comment.isBookmarked).toBe(false);
        });
    });

    // ─── GET /bookmarks includes comments ───────────────────────────────────────

    describe("GET /bookmarks — comment section", () => {
        beforeAll(async () => {
            await server.inject({
                method: "POST",
                url: `${API_PREFIX}/comments/${commentId}/save`,
                headers: { authorization: `Bearer ${accessToken}` },
            });
        });

        it("10. GET /bookmarks should include a non-empty comments array", async () => {
            const res = await server.inject({
                method: "GET",
                url: `${API_PREFIX}/posts/bookmarks`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            expect(res.statusCode).toBe(200);
            const body = JSON.parse(res.payload);
            expect(body.data).toHaveProperty("posts");
            expect(body.data).toHaveProperty("comments");
            expect(Array.isArray(body.data.comments)).toBe(true);
            expect(body.data.comments.length).toBeGreaterThan(0);
        });

        it("11. The bookmarked comment should have isBookmarked=true in the response", async () => {
            const res = await server.inject({
                method: "GET",
                url: `${API_PREFIX}/posts/bookmarks`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            const body = JSON.parse(res.payload);
            const comment = body.data.comments.find(
                (c: { id: string }) => c.id === commentId,
            );
            expect(comment).toBeDefined();
            expect(comment.isBookmarked).toBe(true);
        });

        it("12. Meta should contain postTotal and commentTotal", async () => {
            const res = await server.inject({
                method: "GET",
                url: `${API_PREFIX}/posts/bookmarks`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            const body = JSON.parse(res.payload);
            expect(body.meta).toHaveProperty("postTotal");
            expect(body.meta).toHaveProperty("commentTotal");
            expect(body.meta.commentTotal).toBeGreaterThan(0);
        });
    });

    // ─── isLiked correctness ─────────────────────────────────────────────────────

    describe("isLiked correctness after like/unlike", () => {
        it("13. isLiked should be true after liking the comment", async () => {
            await server.inject({
                method: "POST",
                url: `${API_PREFIX}/comments/${commentId}/like`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            const res = await server.inject({
                method: "GET",
                url: `${API_PREFIX}/posts/${postId}/comments`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            const body = JSON.parse(res.payload);
            const comment = body.data.find(
                (c: { id: string }) => c.id === commentId,
            );
            expect(comment.isLiked).toBe(true);
        });

        it("14. isLiked should be false after unliking the comment", async () => {
            await server.inject({
                method: "DELETE",
                url: `${API_PREFIX}/comments/${commentId}/unlike`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            const res = await server.inject({
                method: "GET",
                url: `${API_PREFIX}/posts/${postId}/comments`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            const body = JSON.parse(res.payload);
            const comment = body.data.find(
                (c: { id: string }) => c.id === commentId,
            );
            expect(comment.isLiked).toBe(false);
        });

        it("15. Anonymous request should still see isLiked=false regardless of DB state", async () => {
            await server.inject({
                method: "POST",
                url: `${API_PREFIX}/comments/${commentId}/like`,
                headers: { authorization: `Bearer ${accessToken}` },
            });

            const res = await server.inject({
                method: "GET",
                url: `${API_PREFIX}/posts/${postId}/comments`,
            });

            const body = JSON.parse(res.payload);
            const comment = body.data.find(
                (c: { id: string }) => c.id === commentId,
            );
            expect(comment.isLiked).toBe(false);
        });
    });
});
