import Fastify, { type FastifyInstance } from "fastify";

// Plugins
import envPlugin from "@plugins/env.plugin";

// Routes
import healthRoutes from "@routes/health.route";

// Hooks
import responseWrapperHook from "@hooks/response-wrapper.hook";

// Custom Plugins
import errorHandlerPlugin from "@plugins/custom/error-handler.plugin";

const isDevelopment = process.env.NODE_ENV === "development";

const server: FastifyInstance = Fastify({
    allowErrorHandlerOverride: true,
    logger: isDevelopment
        ? {
              transport: {
                  target: "pino-pretty",
                  options: {
                      translateTime: "HH:MM:ss Z",
                      ignore: "pid,hostname",
                  },
              },
          }
        : true,
});

/**
 * Registers core Fastify ecosystem plugins.
 * These are typically third-party or foundational environment plugins.
 */
function registerPlugins(): void {
    server.register(envPlugin);
}

/**
 * Registers custom internal plugins.
 * Includes project-specific logic like global error handling.
 */
function registerCustomPlugins(): void {
    server.register(errorHandlerPlugin);
}

/**
 * Registers global lifecycle hooks.
 * Used for intercepting and transforming requests or responses.
 */
function registerHooks(): void {
    server.register(responseWrapperHook);
}

/**
 * Registers application API routes.
 * Applies versioning prefixes to organize endpoints.
 */
function registerRoutes(): void {
    server.register(healthRoutes, { prefix: "/api/v1" });
}

/**
 * Initializes and starts the Fastify server.
 * Orchestrates plugin registration, hook setup, and route mounting
 * before binding to the specified port.
 * * @returns {Promise<void>}
 */
async function startServer(): Promise<void> {
    try {
        registerPlugins();
        await server.after();

        registerCustomPlugins();
        registerHooks();
        registerRoutes();

        // Wait for all plugins to be loaded and decorated
        await server.after();

        await server.listen({ port: server.config.PORT, host: "0.0.0.0" });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

// Entry point execution
void startServer();
