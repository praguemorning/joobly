import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/database/dbConnect";
import { User, type UserProfileTypes } from "@/models/User";
import type { Document } from "mongoose";

export type MongoUser = Document & UserProfileTypes & {
	clerkId?: string;
	admin?: boolean;
};

type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

function primaryEmail(clerkUser: ClerkUser): string | null {
	const primary = clerkUser.emailAddresses.find(
		(e) => e.id === clerkUser.primaryEmailAddressId
	);
	return (
		primary?.emailAddress ??
		clerkUser.emailAddresses[0]?.emailAddress ??
		null
	);
}

function displayName(clerkUser: ClerkUser, email: string): string {
	if (clerkUser.fullName?.trim()) return clerkUser.fullName.trim();
	const parts = [clerkUser.firstName, clerkUser.lastName]
		.filter(Boolean)
		.join(" ")
		.trim();
	if (parts) return parts;
	return email.split("@")[0] || "User";
}

/**
 * Find or create the Mongo user for a Clerk identity (match by clerkId, then email).
 */
export async function ensureMongoUser(
	clerkUser: ClerkUser
): Promise<MongoUser | null> {
	const email = primaryEmail(clerkUser);
	if (!email) return null;

	await dbConnect();

	let user = await User.findOne({ clerkId: clerkUser.id });
	if (user) {
		const updates: Record<string, unknown> = {};
		if (user.email !== email) updates.email = email;
		if (clerkUser.imageUrl && user.image !== clerkUser.imageUrl) {
			updates.image = clerkUser.imageUrl;
		}
		const name = displayName(clerkUser, email);
		if (name && user.name !== name) updates.name = name;
		if (!user.emailVerified) updates.emailVerified = true;
		if (Object.keys(updates).length > 0) {
			user.set(updates);
			await user.save();
		}
		return user as MongoUser;
	}

	user = await User.findOne({ email });
	if (user) {
		user.clerkId = clerkUser.id;
		if (clerkUser.imageUrl) user.image = clerkUser.imageUrl;
		const name = displayName(clerkUser, email);
		if (name) user.name = name;
		user.emailVerified = true;
		await user.save();
		return user as MongoUser;
	}

	user = await User.create({
		clerkId: clerkUser.id,
		email,
		name: displayName(clerkUser, email),
		image: clerkUser.imageUrl,
		emailVerified: true,
		jobPostPoints: 0,
		favoriteJobs: [],
	});

	return user as MongoUser;
}

/**
 * Server-side: Clerk session → Mongo user (creates/links on first request).
 */
export async function getSessionUser(): Promise<MongoUser | null> {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;
	return ensureMongoUser(clerkUser);
}
