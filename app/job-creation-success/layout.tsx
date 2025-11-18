import type { Metadata } from "next";
import "@/lib/styles/globals.scss";

export const metadata: Metadata = {
	title: "Joobly | Success",
	 description:
    'Find multilingual jobs in Prague and across Czechia. English, German, French, and more. We connect expats with top employers.',
  keywords: [
    'multilingual jobs Czechia',
    'English jobs Prague',
    'expat jobs Czech Republic',
    'foreign language jobs',
    'international companies Prague',
  ],
  openGraph: {
    title: 'Joobly.cz – Find Multilingual Jobs in Prague and Czechia',
    description:
      'Explore full-time and part-time multilingual job opportunities in Prague and across Czechia. Connect with top international employers.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'Job search for expats in Czech Republic',
      },
    ],
  },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
		</>
	);
}
