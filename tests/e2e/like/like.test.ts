import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

const FAKE_UUID = "00000000-0000-0000-0000-000000000000";

/**
 * E2E tests for the Like Post endpoint.
 * Validates that an authenticated user can like a post,
 * that the operation is idempotent, and that proper errors are returned
 * for non-existent posts or unauthenticated requests.
 */
describe("POST /posts/:id/like - Like Post", () => {
    const ts = Date.now();
    const user = {
        email: `lp-${ts}@test.com`,
        password: "password123",
        username: `lp${ts}`,
    };

    let accessToken = "";
    let postId = "";

    /**
     * Registers a new test user, logs in to obtain an access token,
     * and creates a post to use as the like target throughout all tests.
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
            payload: { content: "E2E test post for like" },
        });

        postId = parseBody<{ data: { id: string } }>(postRes).data.id;
    });

    it("should return 204 when liking a post", async () => {
        const response = await authRequest(accessToken, {
            method: "POST",
            url: `/posts/${postId}/like`,
        });

        expect(response.statusCode).toBe(204);
    });

    it("should return 204 when liking an already-liked post (idempotent)", async () => {
        const response = await authRequest(accessToken, {
            method: "POST",
            url: `/posts/${postId}/like`,
        });

        expect(response.statusCode).toBe(204);
    });

    it("should return 404 when the post does not exist", async () => {
        const response = await authRequest(accessToken, {
            method: "POST",
            url: `/posts/${FAKE_UUID}/like`,
        });
        const body = parseBody<{ title: string; detail: string }>(response);

        expect(response.statusCode).toBe(404);
        expect(body.title).toBe("NotFoundError");
        expect(body.detail).toBe("Post not found.");
    });

    it("should return 401 when not authenticated", async () => {
        const response = await request({
            method: "POST",
            url: `/posts/${postId}/like`,
        });
        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });
});
