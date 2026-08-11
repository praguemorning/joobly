/** @type {import('next').NextConfig} */
const nextConfig = {
	// Mounted behind praguemorning.cz/jobs via a Cloudflare Worker.
	// basePath also prefixes /_next assets, so no assetPrefix is needed.
	basePath: "/jobs",
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
