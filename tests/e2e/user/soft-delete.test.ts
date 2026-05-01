import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for DELETE /users/me.
 *
 * Validates successful soft-deletion (with correct password), wrong password rejection,
 * schema validation, and auth guard.
 *
 * NOTE: STRICT rate limit (3 handler calls / 15 min).
 * Schema-validation 400 and auth-guard 401 do NOT count against the limit.
 * Handler calls in this suite: wrong password (1), success (2).
 */
describe("DELETE /users/me - Soft Delete Account", () => {
    const ts = Date.now();

    const user = {
        email: `softdel_${ts}@test.com`,
        password: "password123",
        username: `softdel${ts}`.slice(0, 30),
    };

    let accessToken = "";

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

    it("should return 401 when not authenticated", async () => {
        const response = await request({
            method: "DELETE",
            url: "/users/me",
            payload: { password: user.password },
        });

        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });

    it("should return 400 when password field is missing", async () => {
        const response = await authRequest(accessToken, {
            method: "DELETE",
            url: "/users/me",
            payload: {},
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when password is wrong", async () => {
        const response = await authRequest(accessToken, {
            method: "DELETE",
            url: "/users/me",
            payload: { password: "wrongpassword" },
        });

        const body = parseBody<{ title: string; detail: string }>(response);

        expect(response.statusCode).toBe(400);
        expect(body.title).toBe("BadRequestError");
        expect(body.detail).toBe("Invalid password.");
    });

    it("should return 204 when account is deleted with correct password", async () => {
        const response = await authRequest(accessToken, {
            method: "DELETE",
            url: "/users/me",
            payload: { password: user.password },
        });

        expect(response.statusCode).toBe(204);
    });
});
