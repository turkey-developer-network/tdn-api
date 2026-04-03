import { describe, it, expect, beforeAll, afterAll } from "vitest";
import crypto from "node:crypto";
import { server, API_PREFIX } from "./setup";
import type { OAuthExchangePayload } from "src/core/use-cases/oauth/oauth-exchange/oauth-exchange.usecase";

const EXCHANGE_URL = `${API_PREFIX}/oauth/exchange`;

async function seedExchangeCode(
    payload: OAuthExchangePayload,
    ttlSeconds = 60,
): Promise<string> {
    const code = crypto.randomBytes(32).toString("hex");
    const cacheKey = `oauth:exchange:${code}`;
    await server.diContainer.cradle.cacheService.set(
        cacheKey,
        JSON.stringify(payload),
        ttlSeconds,
    );
    return code;
}

describe("E2E OAuth Exchange Flow", () => {
    const testUserPayload: OAuthExchangePayload = {
        userId: "",
        username: "oauth_e2e_user",
        isEmailVerified: true,
    };

    beforeAll(async () => {
        // Clean up any leftover test user
        await server.prisma.user.deleteMany({
            where: { username: testUserPayload.username },
        });

        // Create a real user so the refresh token FK can be satisfied
        const user = await server.prisma.user.create({
            data: {
                username: testUserPayload.username,
                email: "oauth_e2e_user@tdn.test",
                password: null,
                isEmailVerified: true,
            },
        });

        testUserPayload.userId = user.id;
    });

    afterAll(async () => {
        await server.prisma.refreshToken.deleteMany({
            where: { userId: testUserPayload.userId },
        });
        await server.prisma.user.deleteMany({
            where: { username: testUserPayload.username },
        });
    });

    it("1. Valid exchange code → 200 + accessToken + HttpOnly refresh-token cookie", async () => {
        const code = await seedExchangeCode(testUserPayload);

        const response = await server.inject({
            method: "POST",
            url: EXCHANGE_URL,
            payload: { code },
        });

        expect(response.statusCode).toBe(200);

        const body = JSON.parse(response.payload);
        expect(body.data.accessToken).toBeDefined();
        expect(body.data.expiresAt).toBeDefined();
        expect(body.data.user.username).toBe(testUserPayload.username);
        expect(body.data.user.isEmailVerified).toBe(true);
        expect(body.meta.timestamp).toBeDefined();

        const setCookieHeader = response.headers["set-cookie"];
        expect(setCookieHeader).toBeDefined();
        const cookieStr = Array.isArray(setCookieHeader)
            ? setCookieHeader.join("; ")
            : setCookieHeader;
        expect(cookieStr).toMatch(/HttpOnly/i);
        expect(cookieStr).toMatch(/refreshToken=/i);
    });

    it("2. Replay attack — same code used twice → second request returns 401", async () => {
        const code = await seedExchangeCode(testUserPayload);

        const first = await server.inject({
            method: "POST",
            url: EXCHANGE_URL,
            payload: { code },
        });
        expect(first.statusCode).toBe(200);

        const second = await server.inject({
            method: "POST",
            url: EXCHANGE_URL,
            payload: { code },
        });
        expect(second.statusCode).toBe(401);
    });

    it("3. Non-existent code → 401", async () => {
        const fakeCode = crypto.randomBytes(32).toString("hex");

        const response = await server.inject({
            method: "POST",
            url: EXCHANGE_URL,
            payload: { code: fakeCode },
        });

        expect(response.statusCode).toBe(401);
    });

    it("4. Expired code (TTL=1s, wait 2s) → 401", async () => {
        const code = await seedExchangeCode(testUserPayload, 1);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await server.inject({
            method: "POST",
            url: EXCHANGE_URL,
            payload: { code },
        });

        expect(response.statusCode).toBe(401);
    }, 10_000);

    it("5. Missing body → 400", async () => {
        const response = await server.inject({
            method: "POST",
            url: EXCHANGE_URL,
            payload: {},
        });

        expect(response.statusCode).toBe(400);
    });

    it("6. Empty code string → 400", async () => {
        const response = await server.inject({
            method: "POST",
            url: EXCHANGE_URL,
            payload: { code: "" },
        });

        expect(response.statusCode).toBe(400);
    });

    it("7. GitHub callback — error query param → 302 to /login?error=github_access_denied", async () => {
        const response = await server.inject({
            method: "GET",
            url: `${API_PREFIX}/oauth/github/callback?error=access_denied`,
        });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toMatch(/error=github_access_denied/);
    });

    it("8. GitHub callback — missing code param → 302 to /login?error=missing_code", async () => {
        const response = await server.inject({
            method: "GET",
            url: `${API_PREFIX}/oauth/github/callback`,
        });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toMatch(/error=missing_code/);
    });

    it("9. Google callback — error query param → 302 to /login?error=google_access_denied", async () => {
        const response = await server.inject({
            method: "GET",
            url: `${API_PREFIX}/oauth/google/callback?error=access_denied`,
        });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toMatch(/error=google_access_denied/);
    });

    it("10. Google callback — missing code param → 302 to /login?error=missing_code", async () => {
        const response = await server.inject({
            method: "GET",
            url: `${API_PREFIX}/oauth/google/callback`,
        });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toMatch(/error=missing_code/);
    });
});
