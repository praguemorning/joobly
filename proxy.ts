import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest } from "next/server";

/**
 * Public host users (and Clerk) must see. The Cloudflare Worker proxies to a
 * *.vercel.app origin; Vercel often overwrites/prepends X-Forwarded-Host with
 * that internal hostname. Clerk builds handshake redirect_url from the first
 * X-Forwarded-Host value — if that's vercel.app, Back during OAuth lands on a
 * JSON "redirect_url is invalid" error page.
 */
const PUBLIC_HOST = "praguemorning.cz";

function withPublicForwardedHost(req: NextRequest): NextRequest {
	if (process.env.NODE_ENV !== "production") {
		return req;
	}

	const headers = new Headers(req.headers);
	headers.set("x-forwarded-host", PUBLIC_HOST);
	headers.set("x-forwarded-proto", "https");

	return new NextRequest(req.url, {
		method: req.method,
		headers,
	});
}

const clerkHandler = clerkMiddleware({
	authorizedParties: [
		"https://praguemorning.cz",
		"https://www.praguemorning.cz",
		"http://localhost:3000",
	],
});

export default function proxy(req: NextRequest, event: NextFetchEvent) {
	return clerkHandler(withPublicForwardedHost(req), event);
}

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
