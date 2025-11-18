import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "@/lib/styles/globals.scss";
import Header from "@/app/header";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
	title: "Joobly | Jobs",
	 description:
    'Search hundreds of job offers for English, German, French, and Spanish speakers. Updated daily.',
	keywords: [
		'job listings Czechia',
		'foreign language jobs Prague',
		'work in English Czech Republic',
		'multilingual employment',
	],
};

export default function JobLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Toaster/>
			<Header needBackgroundHeader={false}/>
			{children}
		</>
	);
}
