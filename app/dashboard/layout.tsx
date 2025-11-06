"use client"
import "@/lib/styles/globals.scss";
import Header from "../header";
import { SessionProvider } from "next-auth/react";

import { Toaster } from 'react-hot-toast';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<SessionProvider>
				<Toaster />
				<Header needBackgroundHeader={true} topHeaderTitle='' bottomHeaderTitle='Welcome!' />
				{children}
			</SessionProvider>

		</>
	);
}
