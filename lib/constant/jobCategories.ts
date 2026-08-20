/**
 * The category taxonomy shown in the Category filter.
 *
 * Fixed rather than derived from the job records: the stored values had drifted
 * into duplicates and near-synonyms ("HR" alongside "HR & Recruitment",
 * "Hospitality" alongside "Hospitality & Food"), which surfaced directly in the
 * dropdown.
 */
export const JOB_CATEGORIES = [
	"Hospitality & Food",
	"Finance & Accounting",
	"Customer Service",
	"HR & Recruitment",
	"IT & Software Development",
	"Engineering",
	"Manufacturing & Production",
	"Healthcare",
	"Marketing & Advertising",
	"Sales & Business Development",
	"Logistics & Transport",
	"Legal",
	"Education",
	"Construction & Real Estate",
	"Administration",
	"Retail",

];

/**
 * Legacy values still stored on job records, mapped to the canonical name they
 * mean. Without this, selecting "HR & Recruitment" would return nothing —
 * those postings are stored as plain "HR" and the API matches exactly.
 *
 * Safe to delete once the records themselves have been normalised.
 */
export const CATEGORY_ALIASES: Record<string, string[]> = {
	"HR & Recruitment": ["HR & Recruitment", "HR"],
	"Logistics & Transport": ["Logistics & Transport", "Logistics"],
	"Hospitality & Food": ["Hospitality & Food", "Hospitality"],
};

/** Every stored value that should match the given canonical category. */
export function categoryMatches(canonical: string): string[] {
	return CATEGORY_ALIASES[canonical] ?? [canonical];
}
