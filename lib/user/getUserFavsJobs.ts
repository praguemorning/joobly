import { getSessionUser } from "@/lib/auth/session";

export async function getUserFavsJobs(): Promise<string[]> {
	try {
		const user = await getSessionUser();
		if (!user) return [];
		return (user.favoriteJobs || [])
			.map((job) => (job._id != null ? String(job._id) : null))
			.filter((id): id is string => id !== null);
	} catch {
		return [];
	}
}

export async function getUserInfo() {
	try {
		const user = await getSessionUser();
		if (!user || !user._id) return null;
		return user;
	} catch {
		return null;
	}
}
