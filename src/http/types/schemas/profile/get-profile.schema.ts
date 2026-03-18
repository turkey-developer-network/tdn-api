import { Type, type Static } from "@sinclair/typebox";

export const GetProfileParamsSchema = Type.Object({
    username: Type.String({
        minLength: 3,
        maxLength: 30,
        pattern: "^[a-zA-Z0-9._]+$",
    }),
});

export type GetProfileParams = Static<typeof GetProfileParamsSchema>;
