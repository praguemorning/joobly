import { getSessionUser } from "@/lib/auth/session";

export async function getUserFavsJobs() {
	try {
		const user = await getSessionUser();
		if (!user) return [];
		return (user.favoriteJobs || []).map((job: { _id: unknown }) => job._id);
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
