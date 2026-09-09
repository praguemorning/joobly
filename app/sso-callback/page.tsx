"use client";

import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

/**
 * OAuth return page for Google / LinkedIn.
 * Served at /jobs/sso-callback because of next.config basePath.
 *
 * Clerk’s default post-auth redirect is `/`, which on this host is WordPress
 * (outside the jobs app). Force absolute /jobs URLs, and hard-navigate once the
 * session is active — soft router redirects often stall behind the Cloudflare
 * Worker / basePath setup.
 */
function jobsHomeUrl() {
	if (typeof window === "undefined") return "/jobs";
	return `${window.location.origin}/jobs`;
}

export default function SSOCallbackPage() {
	const { isLoaded, isSignedIn } = useAuth();

	useEffect(() => {
		if (isLoaded && isSignedIn) {
			window.location.replace(jobsHomeUrl());
		}
	}, [isLoaded, isSignedIn]);

	// Safety net: if Clerk finishes auth but never flips isSignedIn in this
	// tab (proxy / cookie race), leave the callback page after a short wait.
	useEffect(() => {
		const t = window.setTimeout(() => {
			window.location.replace(jobsHomeUrl());
		}, 8000);
		return () => window.clearTimeout(t);
	}, []);

	const home = jobsHomeUrl();

	return (
		<div className="min-h-[40vh] flex items-center justify-center p-8">
			<AuthenticateWithRedirectCallback
				signInForceRedirectUrl={home}
				signUpForceRedirectUrl={home}
				signInFallbackRedirectUrl={home}
				signUpFallbackRedirectUrl={home}
				continueSignUpUrl="/register"
				signInUrl="/login"
				signUpUrl="/register"
			/>
			<p className="text-gray-500 text-sm">Completing sign-in…</p>
		</div>
	);
}
