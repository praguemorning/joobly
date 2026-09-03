/**
 * Maps job language labels to ISO 3166-1 alpha-2 codes for flagcdn.com.
 * English uses GB — common for expat job boards in Europe.
 */
export const LANGUAGE_FLAG_CODES: Record<string, string> = {
	czech: "cz",
	danish: "dk",
	dutch: "nl",
	english: "gb",
	finnish: "fi",
	french: "fr",
	german: "de",
	hebrew: "il",
	hungarian: "hu",
	indian: "in",
	italian: "it",
	japanese: "jp",
	croatian: "hr",
	norwegian: "no",
	polish: "pl",
	portuguese: "pt",
	russian: "ru",
	slovenian: "si",
	spanish: "es",
	swedish: "se",
	turkish: "tr",
};

/** Split stored language strings like "English / German" or "English, German". */
export function parseJobLanguages(language?: string): string[] {
	if (!language?.trim()) return [];

	return language
		.split(/[/,&]|(?:\s+and\s+)/i)
		.map((part) => part.trim())
		.filter(Boolean);
}

export function getLanguageFlagCode(language: string): string | null {
	return LANGUAGE_FLAG_CODES[language.trim().toLowerCase()] ?? null;
}
