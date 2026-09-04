"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/**
 * Step 2 — OAuth return page for Google / LinkedIn (wired in later steps).
 *
 * Served at /jobs/sso-callback because of next.config basePath.
 * Open http://localhost:3000/jobs/sso-callback to verify the route exists.
 */
export default function SSOCallbackPage() {
	return (
		<div className="min-h-[40vh] flex items-center justify-center p-8">
			<AuthenticateWithRedirectCallback />
			<p className="text-gray-500 text-sm">Completing sign-in…</p>
		</div>
	);
}
