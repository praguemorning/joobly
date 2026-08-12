/**
 * Makes next-auth advertise the public callback URL.
 *
 * next-auth's detectOrigin (next-auth/utils/detect-origin.js) is:
 *
 *   if (process.env.VERCEL ?? process.env.AUTH_TRUST_HOST)
 *     return `${protocol}://${forwardedHost}`;
 *   return process.env.NEXTAUTH_URL;
 *
 * On Vercel that first branch always wins, so NEXTAUTH_URL is ignored no matter
 * where it is set — project settings, vercel.json or code. The forwarded host is
 * the *.vercel.app origin, because the Cloudflare Worker fetches that hostname,
 * and it carries no /jobs prefix. The result is
 * https://<deployment>.vercel.app/api/auth/callback/... — neither the public URL
 * nor a path that exists, so Google rejects the redirect_uri.
 *
 * Clearing the flag drops next-auth back to NEXTAUTH_URL, which we then pin.
 * The blast radius is small: on Vercel each route is its own function, so this
 * only affects the process serving /jobs/api/auth/*. Nothing in this app reads
 * process.env.VERCEL at runtime (next.config.js reads VERCEL_URL, a different
 * variable, at build time).
 *
 * Imported before next-auth in the auth route — ES imports are hoisted, so
 * assigning this in the route body would run too late.
 *
 * Setting NEXTAUTH_URL_PUBLIC overrides the pinned value.
 */
delete process.env.VERCEL;

process.env.NEXTAUTH_URL =
	process.env.NEXTAUTH_URL_PUBLIC ?? "https://praguemorning.cz/jobs/api/auth";

export {};
