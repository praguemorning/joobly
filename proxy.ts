import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Next.js 16 uses proxy.ts (same as former middleware.ts).
 * Public-by-default; Clerk auth is available via auth()/currentUser().
 *
 * authorizedParties: only accept session tokens minted for our public
 * hosts. The Cloudflare Worker must also send X-Forwarded-Host:
 * praguemorning.cz — otherwise Clerk handshake builds redirect_url with
 * the internal *.vercel.app hostname and auth breaks.
 */
export default clerkMiddleware({
	authorizedParties: [
		"https://praguemorning.cz",
		"https://www.praguemorning.cz",
		"http://localhost:3000",
	],
});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
