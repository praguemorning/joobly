import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "@/lib/styles/globals.scss";
import Header from "@/app/header";
import { SITE_URL } from "@/lib/seo/jobPosting";

const mainFont = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Jobs in Prague and Czechia',
    template: '%s | Prague Morning',
  },
  description:
    'Find multilingual jobs in Prague and across Czechia. English, German, French, and more. We connect expats with top employers.',
  openGraph: {
    title: 'Jobs in Prague and Czechia',
    description:
      'Explore full-time and part-time multilingual job opportunities in Prague and across Czechia. Connect with top international employers.',
    url: `${SITE_URL}/post-resume`,
    siteName: 'Prague Morning',
    images: [
      {
        url: '/favicon.ico', // Положи в public/og-image.jpg
        width: 1200,
        height: 630,
        alt: 'Job search for expats in Czech Republic',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        extraBottomHeader='Add your resume and get easier noticed by local recruiters!'
        topHeaderTitle=''
        bottomHeaderTitle='Post your resume'
      />
      {children}
    </>
  );
}
