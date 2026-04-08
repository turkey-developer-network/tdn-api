/**
 * Port interface for text translation operations.
 * Following Clean Architecture principles, this interface defines the contract
 * for translation operations without exposing implementation details.
 */
export interface TranslationPort {
    /**
     * Translates the given text into the target language.
     * @param text - The source text to translate.
     * @param targetLang - The BCP-47 / DeepL language code (e.g. "TR", "EN", "DE").
     * @returns The translated text.
     */
    translate(text: string, targetLang: string): Promise<string>;
}
