import axios from "axios";
import { TranslationFailedError } from "@core/errors";
import type { TranslationPort } from "@core/ports/services/translation.port";

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

export interface DeepLTranslationConfig {
    apiKey: string;
}

interface DeepLResponse {
    translations: Array<{ text: string }>;
}

export class DeepLTranslationService implements TranslationPort {
    constructor(private readonly config: DeepLTranslationConfig) {}

    async translate(text: string, targetLang: string): Promise<string> {
        const response = await axios
            .post<DeepLResponse>(
                DEEPL_API_URL,
                { text: [text], target_lang: targetLang },
                {
                    headers: {
                        Authorization: `DeepL-Auth-Key ${this.config.apiKey}`,
                        "Content-Type": "application/json",
                    },
                },
            )
            .then((res) => res.data)
            .catch((err) => {
                const detail = err.response?.data ?? err.message;
                throw new TranslationFailedError(
                    `DeepL translation failed: ${JSON.stringify(detail)}`,
                );
            });

        const translated = response.translations[0]?.text;
        if (!translated) {
            throw new TranslationFailedError(
                "DeepL returned an empty translation.",
            );
        }

        return translated;
    }
}
