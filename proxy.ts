import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Next.js 16 uses proxy.ts (same as former middleware.ts).
 * Public-by-default; Clerk auth is available via auth()/currentUser().
 */
export default clerkMiddleware();

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
