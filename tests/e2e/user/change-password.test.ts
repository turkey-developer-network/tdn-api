import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for PATCH /users/me/password.
 *
 * Validates current password verification, same-password rejection,
 * successful password change, schema validation, and auth guard.
 *
 * NOTE: STRICT rate limit (3 handler calls / 15 min).
 * Schema-validation 400 and auth-guard 401 do NOT count against the limit.
 * Handler calls in this suite: wrong password (1), same password (2), success (3).
 */
describe("PATCH /users/me/password - Change Password", () => {
    const ts = Date.now();

    const user = {
        email: `chpw_${ts}@test.com`,
        password: "password123",
        username: `chpw${ts}`.slice(0, 30),
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
            url: "/users/me/password",
            payload: {
                currentPassword: "password123",
                newPassword: "newpass456",
            },
        });

        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });

    it("should return 400 when body fields are missing", async () => {
        const response = await authRequest(accessToken, {
            method: "PATCH",
            url: "/users/me/password",
            payload: {},
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when current password is wrong", async () => {
        const response = await authRequest(accessToken, {
            method: "PATCH",
            url: "/users/me/password",
            payload: {
                currentPassword: "wrongpassword",
                newPassword: "newpass456",
            },
        });

        const body = parseBody<{ title: string; detail: string }>(response);

        expect(response.statusCode).toBe(400);
        expect(body.title).toBe("BadRequestError");
        expect(body.detail).toBe("Invalid current password provided.");
    });

    it("should return 400 when new password is the same as current", async () => {
        const response = await authRequest(accessToken, {
            method: "PATCH",
            url: "/users/me/password",
            payload: {
                currentPassword: "password123",
                newPassword: "password123",
            },
        });

        const body = parseBody<{ title: string; detail: string }>(response);

        expect(response.statusCode).toBe(400);
        expect(body.title).toBe("BadRequestError");
        expect(body.detail).toBe(
            "New password must be different from the current one.",
        );
    });

    it("should return 204 when password is changed successfully", async () => {
        const response = await authRequest(accessToken, {
            method: "PATCH",
            url: "/users/me/password",
            payload: {
                currentPassword: "password123",
                newPassword: "newpass456",
            },
        });

        expect(response.statusCode).toBe(204);
    });
});
