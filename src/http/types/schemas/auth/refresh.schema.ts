import { type Static, Type } from "@fastify/type-provider-typebox";
import { ResponseSchema } from "../create-response-schema";

export const RefreshResponseSchema = ResponseSchema(
    Type.Object({
        accessToken: Type.String(),
        expiresAt: Type.Number(),
        user: Type.Object({
            id: Type.String({ format: "uuid" }),
            username: Type.String(),
        }),
    }),
);

export type RefreshResponse = Static<typeof RefreshResponseSchema>;
