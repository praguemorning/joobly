"use client";

import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * OAuth return page for Google / LinkedIn.
 * Served at /jobs/sso-callback because of next.config basePath.
 *
 * Clerk’s default post-auth redirect is `/`, which on this host is WordPress
 * (outside the jobs app). Force absolute /jobs URLs, and also navigate with
 * the Next router once the session is active — covers the case where the
 * callback component finishes auth but never leaves this page.
 */
function jobsHomeUrl() {
	if (typeof window === "undefined") return "/jobs";
	return `${window.location.origin}/jobs`;
}

export default function SSOCallbackPage() {
	const { isLoaded, isSignedIn } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isLoaded && isSignedIn) {
			router.replace("/");
		}
	}, [isLoaded, isSignedIn, router]);

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
