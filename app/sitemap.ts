import type { MetadataRoute } from "next";
import { BACKEND_URL } from "@/lib/constant/constants";
import { isExpired, jobUrl, SITE_URL, type JobLike } from "@/lib/seo/jobPosting";

// Served at /jobs/sitemap.xml because of basePath. Note that search engines
// only read robots.txt from the origin root, which WordPress owns — this
// sitemap must be referenced from praguemorning.cz/robots.txt and submitted in
// Search Console. A robots.ts here would be served at /jobs/robots.txt and
// silently ignored.
// Short-ish, because the job list is fetched via BACKEND_URL and that fetch can
// fail during a build — the deployment is not serving yet while it builds, so
// anything routed back through this deployment is unavailable. A failed fetch
// yields a static-only sitemap, and this bounds how long that persists.
export const revalidate = 900;

async function fetchJobs(): Promise<JobLike[]> {
	try {
		const res = await fetch(`${BACKEND_URL}/jobs`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
		const data = await res.json();
		return Array.isArray(data) ? data : (data?.jobs ?? []);
	} catch (error) {
		// A failed fetch must not fail the whole sitemap — better to serve the
		// static entries than a 500.
		console.error("sitemap: could not load jobs", error);
		return [];
	}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const jobs = await fetchJobs();

	// Expired postings are excluded: Google requires them gone, and they are
	// currently the majority of the collection.
	const live = jobs.filter((job) => job?._id && !isExpired(job));

	const staticPages: MetadataRoute.Sitemap = [
		{ url: SITE_URL, changeFrequency: "daily", priority: 1 },
		{ url: `${SITE_URL}/packages`, changeFrequency: "monthly", priority: 0.5 },
		{ url: `${SITE_URL}/post-job-info`, changeFrequency: "monthly", priority: 0.5 },
		{ url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
	];

	return [
		...staticPages,
		...live.map((job) => {
			const modified = job.updatedAt ?? job.advertisedDate;
			const date = modified ? new Date(modified) : null;
			return {
				url: jobUrl(job),
				...(date && !Number.isNaN(date.getTime()) ? { lastModified: date } : {}),
				changeFrequency: "daily" as const,
				priority: 0.8,
			};
		}),
	];
}
