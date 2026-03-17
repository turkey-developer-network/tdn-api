import { type Static, Type } from "@fastify/type-provider-typebox";

export const UpdateProfileBodySchema = Type.Object(
    {
        fullName: Type.Optional(
            Type.String({
                minLength: 2,
                maxLength: 100,
                description: "User's full name",
            }),
        ),
        bio: Type.Optional(
            Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
        ),
        location: Type.Optional(
            Type.Union([Type.String({ maxLength: 100 }), Type.Null()]),
        ),
        socials: Type.Optional(
            Type.Union([
                Type.Record(Type.String(), Type.String({ format: "uri" })),
                Type.Null(),
            ]),
        ),
    },
    { additionalProperties: false },
);

export type UpdateProfileBody = Static<typeof UpdateProfileBodySchema>;
