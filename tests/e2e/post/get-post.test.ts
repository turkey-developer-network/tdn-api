import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

const FAKE_UUID = "00000000-0000-0000-0000-000000000000";

/**
 * E2E tests for the GET /posts/:id endpoint.
 * Validates single post retrieval for authenticated and
 * unauthenticated users, and proper 404 handling.
 */
describe("GET /posts/:id - Get Post Detail", () => {
    const ts = Date.now();
    const user = {
        email: `pgd-${ts}@test.com`,
        password: "password123",
        username: `pgd${ts}`,
    };

    let accessToken = "";
    let postId = "";

    /**
     * Registers a test user, logs in, and creates a post
     * to use as the retrieval target.
     */
    beforeAll(async () => {
        await request({
            method: "POST",
            url: "/auth/register",
            payload: user,
        });

        const loginRes = await request({
            method: "POST",
            url: "/auth/login",
            payload: { identifier: user.email, password: user.password },
        });

        accessToken = parseBody<{ data: { accessToken: string } }>(loginRes)
            .data.accessToken;

        const postRes = await authRequest(accessToken, {
            method: "POST",
            url: "/posts",
            payload: { content: "E2E post detail test content" },
        });

        postId = parseBody<{ data: { id: string } }>(postRes).data.id;
    });

    it("should return 200 with full post data when authenticated", async () => {
        const response = await authRequest(accessToken, {
            method: "GET",
            url: `/posts/${postId}`,
        });
        const body = parseBody<{
            data: {
                id: string;
                content: string;
                type: string;
                likeCount: number;
                commentCount: number;
                isLiked: boolean;
                isBookmarked: boolean;
                author: { isMe: boolean };
            };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.id).toBe(postId);
        expect(body.data.content).toBe("E2E post detail test content");
        expect(body.data.type).toBe("COMMUNITY");
        expect(body.data.likeCount).toEqual(expect.any(Number));
        expect(body.data.commentCount).toEqual(expect.any(Number));
        expect(body.data.isLiked).toBe(false);
        expect(body.data.isBookmarked).toBe(false);
        expect(body.data.author.isMe).toBe(true);
    });

    it("should return 200 with isMe: false for unauthenticated request", async () => {
        const response = await request({
            method: "GET",
            url: `/posts/${postId}`,
        });
        const body = parseBody<{
            data: { id: string; author: { isMe: boolean } };
        }>(response);

        expect(response.statusCode).toBe(200);
        expect(body.data.id).toBe(postId);
        expect(body.data.author.isMe).toBe(false);
    });

    it("should return 404 when the post does not exist", async () => {
        const response = await request({
            method: "GET",
            url: `/posts/${FAKE_UUID}`,
        });
        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(404);
        expect(body.title).toBe("NotFoundError");
    });
});
