import { type Static, Type } from "@sinclair/typebox";

export const ChangeUsernameSchema = Type.Object({
    newUsername: Type.String({ format: "email" }),
});

export type ChangeUsernameBody = Static<typeof ChangeUsernameSchema>;
