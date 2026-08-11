import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import '@/lib/styles/globals.scss';
import ClientProviders from './providers';
import TopHeader from '@/lib/components/header/header';
import { SITE_URL } from '@/lib/seo/jobPosting';
import { getSiteChrome, PM_ASSETS } from '@/lib/chrome/praguemorning';

// Prague Morning's own typeface, replacing the app's Source Sans.
const mainFont = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

// The app is mounted at praguemorning.cz/jobs, so relative metadata URLs must
// resolve against that prefix, not the bare origin. See SITE_URL in
// lib/seo/jobPosting for why this is not NEXT_PUBLIC_BASE_URL.
export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Jobs in Prague and Czechia',
        // TODO(branding): confirm the public-facing name before launch.
        template: '%s | Prague Morning',
    },
    description:
        'Search hundreds of job offers for English, German, French, and Spanish speakers. Updated daily.',
    robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const { header, footer, adTags, searchOverlay } = await getSiteChrome();

    return (
        <html lang="en">
            <head>
                {/* Next hoists its own imported CSS above these tags, so the
                    theme stylesheet ends up last and wins ties on equal
                    specificity. Generic class names shared with the theme
                    (`.header`, `.container`) therefore need explicit overrides
                    in globals.scss — see the `.header-top` rule there. */}
                <link rel="stylesheet" href={PM_ASSETS.reset} />
                <link rel="stylesheet" href={PM_ASSETS.style} />
            </head>
            <body className={mainFont.className}>
                {/* Consent platform and ad tags, in the live site's own order,
                    so these pages behave like every other page. Server-rendered
                    rather than injected client-side, which is what lets the
                    inline loaders execute at parse time. */}
                {adTags && (
                    <div
                        style={{ display: 'contents' }}
                        dangerouslySetInnerHTML={{ __html: adTags }}
                    />
                )}

                {/* display:contents so the wrapper generates no box — the theme
                    CSS expects <header>/<footer> as top-level page elements. */}
                {header && (
                    <div
                        style={{ display: 'contents' }}
                        dangerouslySetInnerHTML={{ __html: header }}
                    />
                )}

                {/* ClientProviders already supplies SessionProvider. */}
                <ClientProviders>
                    {/* The jobs section's own nav, kept as a secondary bar so
                        Post a job / Packages / Login stay reachable. */}
                    <TopHeader />
                    {children}
                </ClientProviders>

                {footer && (
                    <div
                        style={{ display: 'contents' }}
                        dangerouslySetInnerHTML={{ __html: footer }}
                    />
                )}

                {/* Sits near </body> on the live site, outside <header>. Must be
                    present before main.js runs: openSearch() binds to its close
                    button with no null check, and it runs before the mobile nav
                    is wired, so omitting it throws and kills the burger menu. */}
                {searchOverlay && (
                    <div
                        style={{ display: 'contents' }}
                        dangerouslySetInnerHTML={{ __html: searchOverlay }}
                    />
                )}

                {/* Theme behaviour: burger menu, mobile nav close, search. */}
                <script src={PM_ASSETS.script} defer />
            </body>
        </html>
    );
}
