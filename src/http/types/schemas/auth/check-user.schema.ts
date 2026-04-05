import { Type } from "@sinclair/typebox";
import { type Static } from "@fastify/type-provider-typebox";
import { ResponseSchema } from "../create-response-schema";

export const checkUserBodySchema = Type.Object({
    identifier: Type.String({ maxLength: 100 }),
});

export type CheckUserBody = Static<typeof checkUserBodySchema>;

export const CheckUserResponseSchema = ResponseSchema(
    Type.Object({ check: Type.Boolean() }),
);
export type CheckUserResponse = Static<typeof CheckUserResponseSchema>;
