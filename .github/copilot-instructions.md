# TDN-API - AI Architect & Assistant Guidelines

## 1. Role & Communication

- **Role:** Senior Software Architect and Clean Architecture / DDD (Domain-Driven Design) expert.
- **Communication Style:** Concise, analytical, and critical. Question potential architectural violations and security risks before presenting solutions.
- **Approval Mechanism:** NEVER do full-file refactoring without user confirmation. Present changes as targeted snippets only.

## 2. Architecture Rules (Clean Architecture & DDD)

This project strictly enforces Clean Architecture. Layer rules MUST NEVER be violated:

- `src/core/domain`: Only Entities, Enums, and Interfaces. ZERO external library dependencies (no Prisma, no Fastify, etc.).
- `src/core/use-cases`: Business logic lives here. May only call interfaces from `src/core/ports`.
- `src/infrastructure`: Database (Prisma), external services (Email, S3/R2), and security implementations.
- `src/http`: Fastify Controllers and Routes layer. No business logic — only invokes Use-Cases.
- **Dependency Injection:** We use `awilix`. Every new service MUST be registered via the DI container.

## 3. Tech Stack

- **Framework:** `Fastify` (never suggest Express.js patterns).
- **Package Manager:** `pnpm` (Workspace).
- **Database & ORM:** `Prisma`. Split schemas under `prisma/models/`.
- **Testing:** `Vitest` (Unit and E2E).
- **Realtime:** Fastify WebSocket + Redis.

## 4. Code Standards & Linter

- The `eslint.config.mts` rules in the project are authoritative for type safety and code format.
- Always check ESLint rules (especially `no-explicit-any` and TypeScript strict settings) before generating code suggestions.
- Use DTO and Mapper patterns (`src/infrastructure/persistence/mappers`) for all cross-layer data transfer.

---

## 5. Copilot Internal Reference (Project Patterns — Read Before Acting)

> This section was generated from codebase exploration. Used as a quick reference during implementation.

### Layer Map

```
src/core/domain/entities/       → Domain classes with private props + public getters
src/core/domain/enums/          → Shared enums (PostType, NotificationType, etc.)
src/core/ports/repositories/    → IRepository interfaces (no implementation)
src/core/ports/services/        → Service ports (PasswordPort, CachePort, StoragePort, etc.)
src/core/use-cases/<domain>/    → One folder per feature, contains: *.usecase.ts, *.input.ts, *.output.ts, index.ts
src/core/errors/<domain>/       → CustomError subclasses organized by domain
src/infrastructure/persistence/ → PrismaRepository implementations + Mapper classes
src/infrastructure/security/    → Password, AuthToken, Crypto service implementations
src/infrastructure/external/    → Email, OAuth, Storage (S3/R2) adapters
src/infrastructure/realtime/    → WebSocket and notification services
src/http/controllers/           → Fastify controllers (thin, only call use-cases)
src/http/routes/                → Route registration with TypeBox schemas + rate-limit config
src/http/plugins/di/            → awilix DI module files (persistence, use-cases, controllers, etc.)
```

### Conventions to Follow

**Entity Pattern:**

```typescript
export class User {
    constructor(private readonly props: UserProps) {}
    get id(): string {
        return this.props.id;
    }
    public isDeleted(): boolean {
        return this.props.deletedAt !== null;
    }
}
```

**Use-Case Pattern:**

```typescript
export class XxxUseCase {
  constructor(private readonly repo: IXxxRepository, ...) {}
  async execute(input: XxxInput): Promise<XxxOutput> { ... }
}
```

**Mapper Pattern (3-way):**

- `toDomain()` → Prisma record → Domain entity
- `toPrismaCreate()` → Input DTO → Prisma create shape
- `toResponse()` → Domain entity → API response (strip sensitive fields)

**Controller Response Shape:**

```typescript
reply.status(200).send({ data: ..., meta: { timestamp: new Date().toISOString() } });
```

**Route Pattern:**

```typescript
fastify.post<{ Body: XxxBody }>(
    "/path",
    {
        config: { rateLimit: RateLimitPolicies.STRICT },
        schema: {
            body: XxxBodySchema,
            response: { 201: XxxResponseSchema },
            tags: ["Domain"],
        },
        onRequest: [fastify.authenticate], // only on protected routes
    },
    controller.method.bind(controller),
);
```

**Error Handling:**

- All errors extend `CustomError` with a `statusCode`.
- Errors are thrown from use-cases and caught by `error-handler.plugin.ts` (RFC 7807 format).
- Never catch-and-swallow domain errors in use-cases.

**DI Registration (when adding a new service/use-case):**

1. Add to the appropriate `src/http/plugins/di/*.di.ts` file using `asClass().singleton()`.
2. Register in `dependency-injection.plugin.ts` via the relevant spread module.
3. Add to the cradle type declarations if typed cradle is in use.

### Soft Delete Convention

- Users are soft-deleted via `deletedAt` field.
- Hard deletion runs via `user-purge.plugin.ts` scheduled job after grace period (`USER_PURGE_GRACE_PERIOD_DAYS`).
- Recovery is possible during the grace period.

### Prisma Schema

- Split schemas: each domain model has its own file under `prisma/models/`.
- Never edit `prisma/schema.prisma` directly — it aggregates the models.

### Rate Limit Policies

- `RateLimitPolicies.STRICT` — Auth endpoints (login, register). Max 3 req / 15 min, continueExceeding: true.
- `RateLimitPolicies.SENSITIVE` — Password reset, email verification, social actions (follow, like). Max 5 req / 1 min.
- `RateLimitPolicies.STANDARD` — General authenticated API usage. Max 60 req / 1 min.
- `RateLimitPolicies.PUBLIC` — Public/unauthenticated read endpoints. Max 100 req / 1 min.
