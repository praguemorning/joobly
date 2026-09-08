"use client"
import "@/lib/styles/globals.scss";
import Header from "../header";
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Toaster />
			<Header needBackgroundHeader={true} topHeaderTitle='' bottomHeaderTitle='Welcome!' />
			{children}
		</>
	);
}
