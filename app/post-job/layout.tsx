import type { Metadata } from 'next'
import { Source_Sans_3 } from 'next/font/google'
import '@/lib/styles/globals.scss'
import Header from "@/app/header";
import Footer from "@/app/footer";


const mainFont = Source_Sans_3({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Joobly.cz – Find Multilingual Jobs in Prague and Czechia',
    template: '%s | Joobly.cz',
  },
  description:
    'Find multilingual jobs in Prague and across Czechia. English, German, French, and more. We connect expats with top employers.',
  openGraph: {
    title: 'Joobly.cz – Find Multilingual Jobs in Prague and Czechia',
    description:
      'Explore full-time and part-time multilingual job opportunities in Prague and across Czechia. Connect with top international employers.',
    url: 'https://joobly.cz',
    siteName: 'Joobly.cz',
    images: [
      {
        url: '/favicon.ico',
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
}

export default function JobLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header topHeaderTitle="" bottomHeaderTitle="Post a job" />
      {children}
    </>
  )
}
