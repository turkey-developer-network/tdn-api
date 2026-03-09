import fastifyPlugin from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { authHook } from "../hooks/auth.hook";

function authenticationDecorator(fastify: FastifyInstance): void {
    fastify.decorate("authenticate", authHook);
}

export default fastifyPlugin(authenticationDecorator, {
    name: "authentication-decorator",
    dependencies: ["@fastify/jwt"],
});
