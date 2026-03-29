import { beforeAll, afterAll } from "vitest";
import { App } from "src/app";
import type { FastifyInstance } from "fastify";

export let server: FastifyInstance;
export let app: App;
export const API_PREFIX = "/api/v1";

beforeAll(async () => {
    app = new App();
    await app.init();
    server = app.instance;
});

afterAll(async () => {
    await app.close();
});
