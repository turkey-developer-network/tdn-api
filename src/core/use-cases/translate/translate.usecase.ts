import type { CachePort } from "@core/ports/services/cache.port";
import type { TranslationPort } from "@core/ports/services/translation.port";
import type { TranslateInput } from "./translate.input";
import type { TranslateOutput } from "./translate.output";

const TRANSLATION_CACHE_TTL_SECONDS = 86400;

export class TranslateUseCase {
    constructor(
        private readonly translationService: TranslationPort,
        private readonly cacheService: CachePort,
    ) {}

    async execute(input: TranslateInput): Promise<TranslateOutput> {
        const lang = input.targetLang.toUpperCase();
        const cacheKey = `translation:${lang}:${input.text}`;

        const cached = await this.cacheService.get(cacheKey);
        if (cached !== null) {
            return { translatedText: cached };
        }

        const translatedText = await this.translationService.translate(
            input.text,
            lang,
        );

        await this.cacheService.set(
            cacheKey,
            translatedText,
            TRANSLATION_CACHE_TTL_SECONDS,
        );

        return { translatedText };
    }
}
