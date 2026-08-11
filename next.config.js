/** Public home of the jobs section once it is mounted under Prague Morning. */
const JOBS_URL = "https://praguemorning.cz/jobs";

/** Legacy hostnames whose SEO value is being carried over. */
const LEGACY_HOSTS = ["joobly.cz", "www.joobly.cz"];

/**
 * Origin used to keep pre-basePath /api/* URLs working. Points at the Vercel
 * deployment rather than the public domain deliberately: webhooks should not
 * depend on the Cloudflare Worker being healthy.
 */
const LEGACY_API_ORIGIN =
	process.env.LEGACY_API_ORIGIN ?? "https://joobly-five.vercel.app";

/**
 * 301s from the old domain. These run on the same Vercel deployment, matched by
 * Host header, so joobly.cz keeps working the moment basePath goes live.
 *
 * They cannot loop: praguemorning.cz reaches this app through a Cloudflare
 * Worker that fetches the *.vercel.app hostname, so the Host header is never a
 * legacy host on that path.
 */
function legacyRedirects() {
	return LEGACY_HOSTS.flatMap((value) => {
		const has = [{ type: "host", value }];
		// basePath: false — sources are raw legacy paths, not /jobs-prefixed.
		// statusCode 301 rather than `permanent: true`, which emits 308. Both
		// pass ranking signals, but 301 is what the migration was specified as
		// and nothing here is method-sensitive: /api is excluded below.
		const common = { has, statusCode: 301, basePath: false };

		return [
			// The old marketing splash becomes the listing.
			{ ...common, source: "/", destination: JOBS_URL },

			// Job URLs already contain /jobs, so the path carries over unchanged:
			// joobly.cz/jobs/<slug>-<id> -> praguemorning.cz/jobs/<slug>-<id>.
			// Must precede the catch-all, which would otherwise double the prefix.
			{ ...common, source: "/jobs/:path*", destination: `${JOBS_URL}/:path*` },

			// Everything else gains the /jobs prefix (/login -> /jobs/login).
			//
			// /api is deliberately excluded: Stripe and PayPal POST to
			// /api/webhook and friends, and webhook senders do not follow
			// redirects — redirecting them would silently break payments.
			{
				...common,
				source: "/:path((?!api/).*)",
				destination: `${JOBS_URL}/:path`,
			},
		];
	});
}

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Mounted behind praguemorning.cz/jobs via a Cloudflare Worker.
	// basePath also prefixes /_next assets, so no assetPrefix is needed.
	basePath: "/jobs",
	async redirects() {
		return legacyRedirects();
	},
	async rewrites() {
		return {
			// TRANSITIONAL. basePath moves the API routes to /jobs/api/*, so any
			// webhook still registered against a bare /api/* path would 404 the
			// moment this deploys. Stripe and PayPal do not follow redirects, so
			// this has to be a rewrite. Next requires an absolute destination
			// when basePath is false, hence the origin host rather than a path.
			//
			// Remove once every webhook endpoint in Stripe and PayPal points at
			// <origin>/jobs/api/... directly.
			beforeFiles: [
				{
					source: "/api/:path*",
					destination: `${LEGACY_API_ORIGIN}/jobs/api/:path*`,
					basePath: false,
				},
			],
		};
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "flagcdn.com",
				port: "",
			},
			{
				protocol: 'https',
				hostname: '*.googleusercontent.com'
			},
		],
	},
};

module.exports = nextConfig;
