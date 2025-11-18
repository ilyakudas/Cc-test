/**
 * ChromaWing Breeding Simulator - i18n Module
 * Lightweight internationalization system for multi-language support
 */

// Current language and loaded translations
let currentLang = 'en';
let translations = {};
let fallbackTranslations = {};
let currentNames = [];
let fallbackNames = [];

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'ru', 'uk'];

/**
 * Auto-detect browser language
 * @returns {string} Detected language code or 'en' as fallback
 */
export function detectLanguage() {
    // Get browser language (e.g., 'en-US' -> 'en')
    const browserLang = navigator.language?.split('-')[0] || 'en';

    // Return if supported, otherwise fallback to English
    return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'en';
}

/**
 * Load translation file for a specific language
 * @param {string} lang - Language code (e.g., 'en', 'es')
 * @returns {Promise<boolean>} True if loaded successfully
 */
export async function loadTranslations(lang) {
    try {
        // Load the requested language
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${lang}.json`);
        }

        translations = await response.json();
        currentLang = lang;

        // Load language-specific names
        try {
            const namesResponse = await fetch(`/locales/names/names.${lang}.json`);
            if (namesResponse.ok) {
                const namesData = await namesResponse.json();
                currentNames = namesData.names || [];
                console.log(`i18n: Loaded ${currentNames.length} names for '${lang}'`);
            } else {
                console.warn(`i18n: Failed to load names for '${lang}', using English names`);
                await loadFallbackNames();
            }
        } catch (nameError) {
            console.warn(`i18n: Error loading names for '${lang}', using English names`);
            await loadFallbackNames();
        }

        // Also load English as fallback if not already English
        if (lang !== 'en' && Object.keys(fallbackTranslations).length === 0) {
            try {
                const fallbackResponse = await fetch('/locales/en.json');
                if (fallbackResponse.ok) {
                    fallbackTranslations = await fallbackResponse.json();
                }
            } catch (error) {
                console.warn('Failed to load English fallback translations');
            }
        }

        console.log(`i18n: Loaded translations for '${lang}'`);
        return true;
    } catch (error) {
        console.error(`i18n: Failed to load ${lang}.json, falling back to English`, error);

        // Fallback to English
        try {
            const response = await fetch('/locales/en.json');
            translations = await response.json();
            fallbackTranslations = translations;
            currentLang = 'en';
            await loadFallbackNames();
            return true;
        } catch (fallbackError) {
            console.error('i18n: Failed to load English fallback!', fallbackError);
            return false;
        }
    }
}

/**
 * Load fallback (English) names
 * @private
 */
async function loadFallbackNames() {
    try {
        const namesResponse = await fetch('/locales/names/names.en.json');
        if (namesResponse.ok) {
            const namesData = await namesResponse.json();
            if (currentNames.length === 0) {
                currentNames = namesData.names || [];
            }
            fallbackNames = namesData.names || [];
        }
    } catch (error) {
        console.warn('Failed to load fallback names');
    }
}

/**
 * Translate a key with optional parameter substitution
 * @param {string} key - Translation key in dot notation (e.g., 'common.buy')
 * @param {Object} params - Optional parameters for substitution (e.g., {count: 5})
 * @returns {string} Translated string
 */
export function t(key, params = {}) {
    // Get the translation value
    let value = getNestedValue(translations, key);

    // Try fallback if not found
    if (value === undefined || value === null) {
        value = getNestedValue(fallbackTranslations, key);

        if (value === undefined || value === null) {
            console.warn(`i18n: Missing translation for key '${key}'`);
            return key; // Return the key itself as fallback
        }
    }

    // Replace placeholders like {count}, {name}, etc.
    return replacePlaceholders(value, params);
}

/**
 * Get nested value from object using dot notation
 * @private
 * @param {Object} obj - Object to search
 * @param {string} path - Dot notation path (e.g., 'common.buy')
 * @returns {string|undefined} Value or undefined if not found
 */
function getNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
        if (current === undefined || current === null) {
            return undefined;
        }

        // Skip _meta and _context fields
        if (key === '_meta' || key === '_context') {
            continue;
        }

        current = current[key];
    }

    // If the final value is an object with a 'value' property, return that
    if (current && typeof current === 'object' && 'value' in current) {
        return current.value;
    }

    return current;
}

/**
 * Replace placeholders in a string with parameter values
 * @private
 * @param {string} text - Text with placeholders like {count}, {name}
 * @param {Object} params - Parameters to substitute
 * @returns {string} Text with placeholders replaced
 */
function replacePlaceholders(text, params) {
    if (typeof text !== 'string') {
        return text;
    }

    return Object.entries(params).reduce(
        (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
        text
    );
}

/**
 * Get current language code
 * @returns {string} Current language code
 */
export function getCurrentLanguage() {
    return currentLang;
}

/**
 * Get list of supported languages
 * @returns {string[]} Array of supported language codes
 */
export function getSupportedLanguages() {
    return [...SUPPORTED_LANGUAGES];
}

/**
 * Check if a language is supported
 * @param {string} lang - Language code to check
 * @returns {boolean} True if supported
 */
export function isLanguageSupported(lang) {
    return SUPPORTED_LANGUAGES.includes(lang);
}

/**
 * Get current language-specific name pool
 * @returns {Array<string>} Array of names in current language
 */
export function getNamePool() {
    return currentNames.length > 0 ? [...currentNames] : [...fallbackNames];
}
