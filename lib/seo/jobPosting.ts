import { slugify } from "@/lib/utils/slugify";

/** Public origin including the /jobs base path. */
export const SITE_URL = (
	process.env.NEXT_PUBLIC_BASE_URL ?? "https://praguemorning.cz/jobs"
).replace(/\/$/, "");

export interface JobLike {
	_id: string;
	jobTitle?: string;
	description?: string;
	location?: string;
	workType?: string;
	jobTime?: string;
	salary?: string;
	currency?: string;
	salaryDetail?: string;
	advertisedDate?: string;
	createdAt?: string;
	updatedAt?: string;
	closeDate?: string;
	imageUrl?: string;
	companyDetails?: {
		ceoCompany?: string;
		companyWebsite?: string;
	};
}

export function jobPath(job: JobLike): string {
	return `/${slugify(job.jobTitle ?? "")}-${job._id}`;
}

export function jobUrl(job: JobLike): string {
	return `${SITE_URL}${jobPath(job)}`;
}

/** A posting is expired once closeDate is in the past. */
export function isExpired(job: JobLike, now: Date = new Date()): boolean {
	if (!job.closeDate) return false;
	const closes = new Date(job.closeDate);
	return !Number.isNaN(closes.getTime()) && closes.getTime() < now.getTime();
}

export function datePosted(job: JobLike): string | null {
	const raw = job.advertisedDate ?? job.createdAt;
	if (!raw) return null;
	const d = new Date(raw);
	return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Only values with an unambiguous Google equivalent are mapped. "Permanent",
 * "Any" and "Not Specified" are deliberately left out — schema.org has no
 * matching value and guessing is worse than omitting an optional field.
 */
const EMPLOYMENT_TYPES: Record<string, string> = {
	"full-time": "FULL_TIME",
	"part-time": "PART_TIME",
	freelance: "CONTRACTOR",
	temporary: "TEMPORARY",
	internship: "INTERN",
};

export function employmentTypes(job: JobLike): string[] {
	const found = new Set<string>();
	for (const raw of [job.jobTime, job.workType]) {
		const mapped = EMPLOYMENT_TYPES[String(raw ?? "").trim().toLowerCase()];
		if (mapped) found.add(mapped);
	}
	return Array.from(found);
}

/**
 * Salary is operator-entered free text with no consistent format — observed
 * values include "40,000-80,000", "25,000-40.000", "46 000 - 50 000" and
 * "35,000–53,000". Both "." and "," appear as thousand separators, so neither
 * can be read as a decimal point; all values are monthly CZK in the tens of
 * thousands, where decimals would be meaningless anyway.
 *
 * Returns null unless the result is unambiguous. Publishing a wrong salary is
 * far more damaging than omitting an optional field.
 */
export function parseSalary(raw?: string): { min: number; max: number } | null {
	if (!raw || !/\d/.test(raw)) return null;

	const compact = raw.replace(/\s+/g, "");
	const parts = compact.split(/(?<=\d)[-–—](?=\d)/);
	if (parts.length > 2) return null;

	const numbers: number[] = [];
	for (const part of parts) {
		const digits = part.replace(/[.,]/g, "").replace(/[^\d]/g, "");
		if (!digits) return null;
		const value = Number(digits);
		// Monthly CZK. Anything outside this band is a data-entry error.
		if (!Number.isFinite(value) || value < 1000 || value > 10_000_000) return null;
		numbers.push(value);
	}

	const [min, max = min] = numbers;
	return max < min ? null : { min, max };
}

/**
 * Builds Google-compatible JobPosting JSON-LD, or null when the posting must
 * not be published as structured data (expired, or missing a required field).
 */
export function buildJobPostingSchema(
	job: JobLike | null | undefined,
	now: Date = new Date()
): Record<string, unknown> | null {
	if (!job?._id) return null;

	const title = job.jobTitle?.trim();
	const description = job.description?.trim();
	const company = job.companyDetails?.ceoCompany?.trim();
	const posted = datePosted(job);

	// Google's required fields. Expired postings must not carry the markup.
	if (!title || !description || !company || !posted) return null;
	if (isExpired(job, now)) return null;

	const schema: Record<string, unknown> = {
		"@context": "https://schema.org/",
		"@type": "JobPosting",
		title,
		description,
		datePosted: posted,
		identifier: {
			"@type": "PropertyValue",
			name: company,
			value: job._id,
		},
		hiringOrganization: {
			"@type": "Organization",
			name: company,
			...(job.companyDetails?.companyWebsite
				? { sameAs: job.companyDetails.companyWebsite }
				: {}),
			...(job.imageUrl ? { logo: job.imageUrl } : {}),
		},
		jobLocation: {
			"@type": "Place",
			address: {
				"@type": "PostalAddress",
				// Every posting in the dataset is Prague; blanks are the same.
				addressLocality: job.location?.trim() || "Prague",
				addressCountry: "CZ",
			},
		},
		url: jobUrl(job),
	};

	if (job.closeDate) {
		const closes = new Date(job.closeDate);
		if (!Number.isNaN(closes.getTime())) {
			schema.validThrough = closes.toISOString();
		}
	}

	const types = employmentTypes(job);
	if (types.length) schema.employmentType = types;

	const salary = parseSalary(job.salary);
	if (salary) {
		schema.baseSalary = {
			"@type": "MonetaryAmount",
			currency: job.currency?.trim() || "CZK",
			value: {
				"@type": "QuantitativeValue",
				minValue: salary.min,
				maxValue: salary.max,
				unitText: "MONTH",
			},
		};
	}

	return schema;
}

/** Collapses a job's HTML description into plain text for meta descriptions. */
export function plainTextExcerpt(html: string | undefined, max = 160): string {
	if (!html) return "";
	const text = html
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, " ")
		.trim();

	if (text.length <= max) return text;
	const cut = text.slice(0, max);
	const lastSpace = cut.lastIndexOf(" ");
	return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
