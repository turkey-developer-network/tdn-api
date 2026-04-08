import { Type } from "@sinclair/typebox";
import { type Static } from "@fastify/type-provider-typebox";
import { ResponseSchema } from "../create-response-schema";

export const TranslateBodySchema = Type.Object({
    text: Type.String({ minLength: 1, maxLength: 5000 }),
    targetLang: Type.String({ minLength: 2, maxLength: 5 }),
});

export type TranslateBody = Static<typeof TranslateBodySchema>;

export const TranslateResponseDataSchema = Type.Object({
    translatedText: Type.String(),
});

export const TranslateResponseSchema = ResponseSchema(
    TranslateResponseDataSchema,
);
export type TranslateResponse = Static<typeof TranslateResponseSchema>;
