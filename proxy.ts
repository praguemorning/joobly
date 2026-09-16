import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Public host users (and Clerk) must see. The Cloudflare Worker proxies to a
 * *.vercel.app origin; Vercel overwrites x-forwarded-host with that internal
 * hostname. Next.js uses x-forwarded-host for its Server Actions CSRF check —
 * if it doesn't match the browser's origin header, login/logout 500s.
 */
const PUBLIC_HOST = "praguemorning.cz";

export default clerkMiddleware(
	(_auth, req: NextRequest) => {
		if (process.env.NODE_ENV !== "production") {
			return NextResponse.next();
		}

		const headers = new Headers(req.headers);
		headers.set("x-forwarded-host", PUBLIC_HOST);
		headers.set("x-forwarded-proto", "https");

		// NextResponse.next({ request: { headers } }) is the only way to make
		// modified headers visible to route handlers and Server Actions.
		return NextResponse.next({ request: { headers } });
	},
	{
		authorizedParties: [
			"https://praguemorning.cz",
			"https://www.praguemorning.cz",
			"http://localhost:3000",
		],
	},
);

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};