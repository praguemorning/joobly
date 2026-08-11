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
	/** Ad and consent tags, in the order the live site declares them. */
	adTags: string;
	/** Search overlay the header buttons open; required by the theme JS. */
	searchOverlay: string | null;
}

/**
 * Ad and consent stack shared with the rest of praguemorning.cz. The consent
 * platform (Clickio) is included deliberately: the ad tags are gated by it, so
 * shipping ads without it would fire third-party scripts outside the site's
 * consent framework.
 *
 * Source order is preserved rather than reordered, so these pages behave
 * exactly like every other page on the site.
 */
const AD_TAG_PATTERNS = [
	/clickio/i, // CMP
	/consensu\.org/i, // CMP (IAB TCF endpoint)
	/googletagmanager\.com\/gtag/i,
	/adsbygoogle/i,
	/themoneytizer/i,
	/clever-core|cleverwebserver/i, // the side rails
];

/** The homepage carries exactly one <header> and one <footer>. */
function extractElement(html: string, tag: "header" | "footer"): string | null {
	const open = html.indexOf(`<${tag}`);
	if (open === -1) return null;
	const close = html.indexOf(`</${tag}>`, open);
	if (close === -1) return null;
	return html.slice(open, close + tag.length + 3);
}

/**
 * The search overlay the header's search buttons open. It lives near </body>,
 * outside <header>, so it is not picked up with the rest of the chrome.
 *
 * It is not optional. The theme's openSearch() binds to its close button with
 * no null check and runs before the mobile nav is wired up, so omitting this
 * markup throws and leaves the burger menu dead.
 */
function extractSearchOverlay(html: string): string | null {
	const marker = html.indexOf('class="search-main"');
	if (marker === -1) return null;

	const start = html.lastIndexOf("<", marker);
	const pattern = /<div\b|<\/div>/g;
	pattern.lastIndex = start;

	let depth = 0;
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(html))) {
		depth += match[0] === "</div>" ? -1 : 1;
		if (depth === 0) return html.slice(start, match.index + match[0].length);
	}
	return null;
}

/** Pulls the ad/consent <script> tags, plus Clever Core's placeholder div. */
function extractAdTags(html: string): string {
	const head = html.slice(0, html.indexOf("</head>"));
	const tags = (head.match(/<script\b[^>]*>[\s\S]*?<\/script>/g) ?? []).filter(
		(tag) => AD_TAG_PATTERNS.some((pattern) => pattern.test(tag))
	);

	// Clever Core looks for this marker to place the side rails.
	if (/clever-core/i.test(tags.join("")) && /clever-core-ads/.test(head)) {
		tags.push('<div class="clever-core-ads"></div>');
	}
	return tags.join("\n");
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
			adTags: extractAdTags(html),
			searchOverlay: extractSearchOverlay(html),
		};
	} catch (error) {
		// Never take the jobs section down because the main site is unreachable.
		console.error("site chrome: could not load praguemorning.cz", error);
		return { header: null, footer: null, adTags: "", searchOverlay: null };
	}
}
