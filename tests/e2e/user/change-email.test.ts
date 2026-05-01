import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for PATCH /users/me/email.
 *
 * Validates successful email change, schema validation (format + missing field),
 * and auth guard.
 *
 * NOTE: STRICT rate limit (3 handler calls / 15 min).
 * Schema-validation 400 and auth-guard 401 do NOT count against the limit.
 * Handler calls in this suite: success (1).
 */
describe("PATCH /users/me/email - Change Email", () => {
    const ts = Date.now();

    const user = {
        email: `chemail_${ts}@test.com`,
        password: "password123",
        username: `chemail${ts}`.slice(0, 30),
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
            method: "PATCH",
            url: "/users/me/email",
            payload: { newEmail: `new_${ts}@test.com` },
        });

        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });

    it("should return 400 when newEmail field is missing", async () => {
        const response = await authRequest(accessToken, {
            method: "PATCH",
            url: "/users/me/email",
            payload: {},
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when newEmail is not a valid email format", async () => {
        const response = await authRequest(accessToken, {
            method: "PATCH",
            url: "/users/me/email",
            payload: { newEmail: "not-an-email" },
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 204 when email is changed successfully", async () => {
        const response = await authRequest(accessToken, {
            method: "PATCH",
            url: "/users/me/email",
            payload: { newEmail: `chemail_new_${ts}@test.com` },
        });

        expect(response.statusCode).toBe(204);
    });
});
