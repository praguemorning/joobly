/**
 * Pulls Prague Morning's real header and footer out of the live WordPress site
 * so the jobs section is visually part of praguemorning.cz.
 *
 * Fetching rather than replicating keeps the navigation in sync — news
 * categories change and a copied menu would quietly drift. The cost is a
 * coupling to the theme's markup, so every failure path here degrades to
 * rendering nothing rather than breaking the page.
 *
 * No request loop: only /jobs* is routed to this app by the Cloudflare Worker,
 * so fetching the site root reaches WordPress directly.
 */

export const PM_ORIGIN = "https://praguemorning.cz";
const THEME = `${PM_ORIGIN}/wp-content/themes/prague-morning`;

export const PM_ASSETS = {
	reset: `${THEME}/css/reset.css`,
	style: `${THEME}/css/style.css`,
	// Drives the burger menu, the mobile nav close button and the footer
	// newsletter field. Without it the header renders but does not open.
	script: `${THEME}/js/main.js`,
};

export interface SiteChrome {
	header: string | null;
	footer: string | null;
}

/** The homepage carries exactly one <header> and one <footer>. */
function extractElement(html: string, tag: "header" | "footer"): string | null {
	const open = html.indexOf(`<${tag}`);
	if (open === -1) return null;
	const close = html.indexOf(`</${tag}>`, open);
	if (close === -1) return null;
	return html.slice(open, close + tag.length + 3);
}

export async function getSiteChrome(): Promise<SiteChrome> {
	try {
		const res = await fetch(PM_ORIGIN, {
			next: { revalidate: 3600 },
			headers: { "user-agent": "praguemorning-jobs" },
		});
		if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

		const html = await res.text();
		return {
			header: extractElement(html, "header"),
			footer: extractElement(html, "footer"),
		};
	} catch (error) {
		// Never take the jobs section down because the main site is unreachable.
		console.error("site chrome: could not load praguemorning.cz", error);
		return { header: null, footer: null };
	}
}
