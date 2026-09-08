import { FEATURED_DURATION_DAYS } from "@/lib/constant/constants";

export type FeaturedLike = {
	isFeatured?: boolean;
	featuredUntil?: Date | string | null;
};

/** True when Featured is purchased/activated and the window has not expired. */
export function isFeaturedActive(job: FeaturedLike | null | undefined, now = new Date()): boolean {
	if (!job?.isFeatured || !job.featuredUntil) return false;
	const until = job.featuredUntil instanceof Date ? job.featuredUntil : new Date(job.featuredUntil);
	return !Number.isNaN(until.getTime()) && until.getTime() > now.getTime();
}

export function featuredUntilFromNow(now = new Date()): Date {
	const until = new Date(now);
	until.setDate(until.getDate() + FEATURED_DURATION_DAYS);
	return until;
}

/** Active featured first, then by createdAt descending. */
export function sortJobsFeaturedFirst<T extends FeaturedLike & { createdAt?: Date | string }>(
	jobs: T[],
	now = new Date(),
): T[] {
	return [...jobs].sort((a, b) => {
		const aFeatured = isFeaturedActive(a, now) ? 1 : 0;
		const bFeatured = isFeaturedActive(b, now) ? 1 : 0;
		if (aFeatured !== bFeatured) return bFeatured - aFeatured;

		const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
		const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
		return bTime - aTime;
	});
}
