import { parseBody, request } from "../setup";
import { describe, expect, it } from "vitest";

/**
 * E2E tests for POST /oauth/exchange endpoint.
 * Validates that a valid exchange code returns a session with tokens,
 * and that invalid or missing codes are rejected with the correct errors.
 *
 * Note: Obtaining a real exchange code requires a full GitHub/Google OAuth
 * callback flow and is therefore out of scope for e2e tests.
 * The happy path is covered indirectly by the GitHub/Google callback flow tests.
 */
describe("POST /oauth/exchange - OAuth Token Exchange", () => {
    it("should return 401 when the exchange code is invalid or expired", async () => {
        const response = await request({
            method: "POST",
            url: "/oauth/exchange",
            payload: { code: "invalid-or-expired-code" },
        });
        const body = parseBody<{ title: string; detail: string }>(response);

        expect(response.statusCode).toBe(401);
        expect(body.title).toBe("UnauthorizedError");
        expect(body.detail).toBe("Invalid or expired exchange code");
    });

    it("should return 400 when the code field is an empty string", async () => {
        const response = await request({
            method: "POST",
            url: "/oauth/exchange",
            payload: { code: "" },
        });

        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when the request body is missing entirely", async () => {
        const response = await request({
            method: "POST",
            url: "/oauth/exchange",
        });

        expect(response.statusCode).toBe(400);
    });
});
