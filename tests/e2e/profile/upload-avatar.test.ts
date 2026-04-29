import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for the PATCH /profiles/me/avatar endpoint.
 * Happy-path (actual file upload) requires S3/R2 which is not available
 * in the e2e environment, so only error cases are covered here.
 */
describe("PATCH /profiles/me/avatar - Upload Avatar", () => {
    const ts = Date.now();
    const user = {
        email: `avt-${ts}@test.com`,
        password: "password123",
        username: `avt${ts}`,
    };

    let accessToken = "";

    /**
     * Registers a user and logs in to obtain an access token.
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

    it("should return 406 when request is not multipart / no file provided", async () => {
        const response = await authRequest(accessToken, {
            method: "PATCH",
            url: "/profiles/me/avatar",
            payload: {},
        });

        expect(response.statusCode).toBe(406);
    });

    it("should return 401 when not authenticated", async () => {
        const response = await request({
            method: "PATCH",
            url: "/profiles/me/avatar",
            payload: {},
        });
        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });
});
