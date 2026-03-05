import fastifyPlugin from "fastify-plugin";
import { AuthService } from "../services/auth.service";
import { type FastifyInstance } from "fastify";

function authServiceDecorator(fastify: FastifyInstance): void {
    fastify.decorate("authService", new AuthService(fastify.prisma));
}

export default fastifyPlugin(authServiceDecorator);
