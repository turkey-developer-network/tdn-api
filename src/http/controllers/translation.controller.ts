import type { TranslateUseCase } from "@core/use-cases/translate";
import type { TranslateBody } from "@typings/schemas/translate/translate.schema";
import type { FastifyReply, FastifyRequest } from "fastify";

export class TranslationController {
    constructor(private readonly translateUseCase: TranslateUseCase) {}

    async translate(
        request: FastifyRequest<{ Body: TranslateBody }>,
        reply: FastifyReply,
    ): Promise<void> {
        const output = await this.translateUseCase.execute({
            text: request.body.text,
            targetLang: request.body.targetLang,
        });

        return reply.status(200).send({
            data: { translatedText: output.translatedText },
            meta: { timestamp: new Date().toISOString() },
        });
    }
}
