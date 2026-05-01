import { authRequest, parseBody, request } from "../setup";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * E2E tests for PATCH /users/me/username.
 *
 * Validates successful username change, conflict on taken username,
 * schema validation, and auth guard.
 *
 * NOTE: STRICT rate limit (3 handler calls / 15 min).
 * Schema-validation 400 and auth-guard 401 do NOT count against the limit.
 * Handler calls in this suite: success (1), conflict (2).
 */
describe("PATCH /users/me/username - Change Username", () => {
    const ts = Date.now();

    const userA = {
        email: `chunA_${ts}@test.com`,
        password: "password123",
        username: `chunA${ts}`.slice(0, 30),
    };

    const userB = {
        email: `chunB_${ts}@test.com`,
        password: "password123",
        username: `chunB${ts}`.slice(0, 30),
    };

    let tokenA = "";

    beforeAll(async () => {
        await request({
            method: "POST",
            url: "/auth/register",
            payload: userA,
        });

        const loginA = await request({
            method: "POST",
            url: "/auth/login",
            payload: { identifier: userA.email, password: userA.password },
        });

        tokenA = parseBody<{ data: { accessToken: string } }>(loginA).data
            .accessToken;

        // Register userB so we have a taken username for the conflict test
        await request({
            method: "POST",
            url: "/auth/register",
            payload: userB,
        });
    });

    it("should return 401 when not authenticated", async () => {
        const response = await request({
            method: "PATCH",
            url: "/users/me/username",
            payload: { newUsername: "someusername" },
        });

        const body = parseBody<{ title: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
    });

    it("should return 400 when newUsername field is missing", async () => {
        const response = await authRequest(tokenA, {
            method: "PATCH",
            url: "/users/me/username",
            payload: {},
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 204 when username is changed successfully", async () => {
        const newUsername = `chunAnew${ts}`.slice(0, 30);

        const response = await authRequest(tokenA, {
            method: "PATCH",
            url: "/users/me/username",
            payload: { newUsername },
        });

        expect(response.statusCode).toBe(204);
    });

    it("should return 409 when the new username is already taken", async () => {
        const response = await authRequest(tokenA, {
            method: "PATCH",
            url: "/users/me/username",
            payload: { newUsername: userB.username },
        });

        const body = parseBody<{ title: string; detail: string }>(response);

        expect(response.statusCode).toBe(409);
        expect(body.title).toBe("ConflictError");
        expect(body.detail).toBe(
            "This username is already taken. Please choose another one.",
        );
    });
});
