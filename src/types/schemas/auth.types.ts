import { type Static, Type } from "@sinclair/typebox";

export const RegisterBodySchema = Type.Object({
    email: Type.String({ format: "email" }),
    username: Type.String({ minLength: 3, maxLength: 32 }),
    password: Type.String({ minLength: 8 }),
});

export type RegisterBody = Static<typeof RegisterBodySchema>;
