/**
 * Pins NEXTAUTH_URL before next-auth is ever imported.
 *
 * next-auth reads this when it initialises, and ES imports are hoisted — so
 * assigning it inside the route module runs too late, after next-auth has
 * already captured whatever the platform provided. Importing this module first
 * is what makes the assignment win.
 *
 * It has to be pinned at all because the app is reached through a Cloudflare
 * Worker that fetches the *.vercel.app origin: the request Host is never
 * praguemorning.cz, and Next's basePath ("/jobs") is not applied to next-auth's
 * own routes. Left alone it advertises
 * https://<deployment>.vercel.app/api/auth/callback/... — neither the public URL
 * nor a path that exists — and Google rejects the redirect_uri.
 *
 * Setting NEXTAUTH_URL_PUBLIC in the Vercel project overrides this.
 */
process.env.NEXTAUTH_URL =
	process.env.NEXTAUTH_URL_PUBLIC ?? "https://praguemorning.cz/jobs/api/auth";

export {};
