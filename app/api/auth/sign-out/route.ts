import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Server-side sign-out. Client `clerk.signOut()` often hangs in production
 * behind the Cloudflare Worker (handshake / redirect_url issues). Revoking
 * the session via the Backend API still invalidates it.
 */
export async function POST() {
	try {
		const { sessionId } = await auth();
		if (!sessionId) {
			return NextResponse.json({ ok: true, alreadySignedOut: true });
		}

		const client = await clerkClient();
		await client.sessions.revokeSession(sessionId);

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Server sign-out failed:", error);
		return NextResponse.json(
			{ ok: false, error: "Failed to revoke session" },
			{ status: 500 },
		);
	}
}
