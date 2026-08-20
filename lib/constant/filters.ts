/**
 * Fixed option lists for the job filters.
 *
 * Defined here rather than derived from the job records: the stored values had
 * drifted, and several of these options describe jobs that have not been posted
 * yet, which a data-derived list can never show.
 */

export const LANGUAGES = [
	"English",
	"German",
	"Spanish",
	"French",
	"Italian",
	"Dutch",
	"Polish",
	"Russian",
	"Swedish",
	"Norwegian",
	"Danish",
	"Hungarian",
	"Slovenian",
	"Croatian",
	"Hebrew",
];

export const EXPERIENCE_LEVELS = [
	"No experience",
	"Entry level (0–2 years)",
	"Mid-level (3–5 years)",
	"Senior (5+ years)",
	"Not specified",
];

/**
 * Job Type, replacing the old Job Time filter.
 *
 * The four options do not live in one field: Full-time and Part-time are stored
 * on jobTime, while Temporary and contract work are on workType. Each option
 * therefore maps to the field and value that actually holds it.
 */
export const JOB_TYPES = [
	"Full-time",
	"Part-time",
	"Temporary",
	"Contract work (IČO)",
];

export const JOB_TYPE_FIELDS: Record<string, { field: string; values: string[] }> = {
	"Full-time": { field: "jobTime", values: ["Full-time"] },
	"Part-time": { field: "jobTime", values: ["Part-time"] },
	Temporary: { field: "workType", values: ["Temporary"] },
	"Contract work (IČO)": { field: "workType", values: ["Freelance"] },
};

/**
 * Salary bands.
 *
 * `salary` is operator-entered free text ("40,000-80,000", "46 000 - 50 000",
 * "not-specified"), so these cannot be matched in the database query — the API
 * parses each posting and compares numerically. A band matches when the
 * posting's range overlaps it at all.
 */
export const SALARY_BANDS = [
	"Under CZK 30,000",
	"CZK 30,000–40,000",
	"CZK 40,000–50,000",
	"CZK 50,000–60,000",
	"CZK 60,000–80,000",
	"CZK 80,000–100,000",
	"CZK 100,000+",
	"Salary not specified",
];

export const SALARY_NOT_SPECIFIED = "Salary not specified";

/** Inclusive lower bound, exclusive upper bound. null means unbounded. */
export const SALARY_RANGES: Record<string, { min: number; max: number | null }> = {
	"Under CZK 30,000": { min: 0, max: 30000 },
	"CZK 30,000–40,000": { min: 30000, max: 40000 },
	"CZK 40,000–50,000": { min: 40000, max: 50000 },
	"CZK 50,000–60,000": { min: 50000, max: 60000 },
	"CZK 60,000–80,000": { min: 60000, max: 80000 },
	"CZK 80,000–100,000": { min: 80000, max: 100000 },
	"CZK 100,000+": { min: 100000, max: null },
};
