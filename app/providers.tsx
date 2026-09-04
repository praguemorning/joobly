"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import store from "@/lib/store";

/**
 * next-auth's client defaults to /api/auth, which does not exist here: the app
 * is mounted at /jobs, and only /jobs* is routed to it — anything else reaches
 * WordPress. Without this, session lookups and signIn() calls hit
 * praguemorning.cz/api/auth/... and 404.
 *
 * Step 1: ClerkProvider wraps the tree so Clerk is ready; NextAuth SessionProvider
 * stays until later steps migrate login.
 */
const AUTH_BASE_PATH = "/jobs/api/auth";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
	return (
		// `dynamic` is required on App Router so Clerk can initialize auth on the client.
		<ClerkProvider dynamic>
			<SessionProvider basePath={AUTH_BASE_PATH}>
				<Provider store={store}>{children}</Provider>
			</SessionProvider>
		</ClerkProvider>
	);
}
