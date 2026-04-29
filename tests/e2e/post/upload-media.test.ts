import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for the POST /media endpoint.
 * Validates auth guards and non-multipart request handling.
 *
 * Note: The happy path (actual file upload) requires a live S3/R2 connection
 * and is therefore out of scope for e2e tests.
 */
describe("POST /media - Upload Post Media", () => {
    const ts = Date.now();
    const user = {
        email: `pum-${ts}@test.com`,
        password: "password123",
        username: `pum${ts}`,
    };

    let accessToken = "";

    /**
     * Registers a test user and logs in to obtain an access token.
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
    });

    it("should return 400 when request is not multipart/form-data", async () => {
        const response = await authRequest(accessToken, {
            method: "POST",
            url: "/media",
            payload: { file: "not-a-real-file" },
        });
        const body = parseBody<{ title: string; detail: string }>(response);

        expect(response.statusCode).toBe(400);
        expect(body.title).toBe("NoMediaProvidedError");
        expect(body.detail).toBe(
            "Please send a multipart/form-data request with at least one media file.",
        );
    });

    it("should return 401 when not authenticated", async () => {
        const response = await request({
            method: "POST",
            url: "/media",
        });
        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });
});
