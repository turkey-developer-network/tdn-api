import { type FastifyInstance } from "fastify";

export default function healthRoutes(fastify: FastifyInstance): void {
    fastify.get("/health", () => {
        return {
            status: "ok",
        };
    });
}
