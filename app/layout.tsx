import { Source_Sans_3 } from 'next/font/google';
import type { Metadata } from 'next';
import '@/lib/styles/globals.scss';
import ClientProviders from './providers';
import Footer from '@/app/footer';
import TopHeader from '@/lib/components/header/header';
import { SITE_URL } from '@/lib/seo/jobPosting';

const mainFont = Source_Sans_3({ subsets: ['latin'] });

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={mainFont.className}>
                {/* ClientProviders already supplies SessionProvider. */}
                <ClientProviders>
                    <TopHeader />
                    {children}
                    <Footer />
                </ClientProviders>
            </body>
        </html>
    );
}
