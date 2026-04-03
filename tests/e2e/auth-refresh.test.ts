import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { server, API_PREFIX } from "./setup";

describe("E2E Auth - Refresh Token", () => {
    const testUser = {
        email: "refresh.tester@tdn.com",
        username: "refresh_tester_99",
        password: "Refresh$ecure123!",
    };

    let refreshTokenCookie: string = "";

    beforeAll(async () => {
        await server.prisma.user.deleteMany({
            where: { username: testUser.username },
        });

        await server.inject({
            method: "POST",
            url: `${API_PREFIX}/auth/register`,
            payload: testUser,
        });

        const loginRes = await server.inject({
            method: "POST",
            url: `${API_PREFIX}/auth/login`,
            payload: {
                identifier: testUser.email,
                password: testUser.password,
            },
        });

        const setCookie = loginRes.headers["set-cookie"];
        if (Array.isArray(setCookie)) {
            const found = setCookie.find((c) =>
                c.startsWith("refreshToken="),
            );
            refreshTokenCookie = found ?? "";
        } else if (typeof setCookie === "string") {
            refreshTokenCookie = setCookie;
        }
    });

    afterAll(async () => {
        await server.prisma.user.deleteMany({
            where: { username: testUser.username },
        });
    });

    it("1. returns 401 when no cookie and no body", async () => {
        const res = await server.inject({
            method: "POST",
            url: `${API_PREFIX}/auth/refresh`,
        });
        expect(res.statusCode).toBe(401);
    });

    it("2. returns 401 when cookie has invalid signature", async () => {
        const res = await server.inject({
            method: "POST",
            url: `${API_PREFIX}/auth/refresh`,
            headers: { cookie: "refreshToken=tampered.invalid.signature" },
        });
        expect(res.statusCode).toBe(401);
    });

    it("3. returns 401 when body has a random invalid refreshToken string", async () => {
        const res = await server.inject({
            method: "POST",
            url: `${API_PREFIX}/auth/refresh`,
            headers: { "content-type": "application/json" },
            payload: { refreshToken: "completely_invalid_token_value" },
        });
        expect(res.statusCode).toBe(401);
    });

    it("4. returns 200 with new tokens using a valid refresh cookie", async () => {
        expect(refreshTokenCookie).not.toBe("");

        const res = await server.inject({
            method: "POST",
            url: `${API_PREFIX}/auth/refresh`,
            headers: { cookie: refreshTokenCookie },
        });

        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.payload);
        expect(body.data).toHaveProperty("accessToken");
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("5. returns 401 after using the same refresh cookie twice (token rotation)", async () => {
        expect(refreshTokenCookie).not.toBe("");

        const res = await server.inject({
            method: "POST",
            url: `${API_PREFIX}/auth/refresh`,
            headers: { cookie: refreshTokenCookie },
        });

        // First token has been rotated away already, second use must fail
        expect(res.statusCode).toBe(401);
    });
});
