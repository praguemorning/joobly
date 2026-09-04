"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "react-redux";
import store from "@/lib/store";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
	return (
		// `dynamic` is required on App Router so Clerk can initialize auth on the client.
		<ClerkProvider dynamic>
			<Provider store={store}>{children}</Provider>
		</ClerkProvider>
	);
}
