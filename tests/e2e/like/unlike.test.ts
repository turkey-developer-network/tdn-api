import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

const FAKE_UUID = "00000000-0000-0000-0000-000000000000";

/**
 * E2E tests for the Unlike Post endpoint.
 * Validates that an authenticated user can unlike a post,
 * that the operation is idempotent when no like exists,
 * and that proper errors are returned for non-existent posts or unauthenticated requests.
 */
describe("DELETE /posts/:id/unlike - Unlike Post", () => {
    const ts = Date.now();
    const user = {
        email: `ulp-${ts}@test.com`,
        password: "password123",
        username: `ulp${ts}`,
    };

    let accessToken = "";
    let postId = "";

    /**
     * Registers a new test user, logs in to obtain an access token,
     * creates a post to use as the unlike target throughout all tests.
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
            payload: { content: "E2E test post for unlike" },
        });

        postId = parseBody<{ data: { id: string } }>(postRes).data.id;

        await authRequest(accessToken, {
            method: "POST",
            url: `/posts/${postId}/like`,
        });
    });

    it("should return 204 when unliking a liked post", async () => {
        const response = await authRequest(accessToken, {
            method: "DELETE",
            url: `/posts/${postId}/unlike`,
        });

        expect(response.statusCode).toBe(204);
    });

    it("should return 204 when unliking a post with no existing like (idempotent)", async () => {
        const response = await authRequest(accessToken, {
            method: "DELETE",
            url: `/posts/${postId}/unlike`,
        });

        expect(response.statusCode).toBe(204);
    });

    it("should return 404 when the post does not exist", async () => {
        const response = await authRequest(accessToken, {
            method: "DELETE",
            url: `/posts/${FAKE_UUID}/unlike`,
        });
        const body = parseBody<{ title: string; detail: string }>(response);

        expect(response.statusCode).toBe(404);
        expect(body.title).toBe("NotFoundError");
        expect(body.detail).toBe("Post not found.");
    });

    it("should return 401 when not authenticated", async () => {
        const response = await request({
            method: "DELETE",
            url: `/posts/${postId}/unlike`,
        });
        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });
});
