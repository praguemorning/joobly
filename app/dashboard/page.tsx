import DashboardPage from "@/lib/components/dashboard/DashboardPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Profile",
	description: "User dashboard",
};

export default function Dashboard() {
  return (
    <section className="mt-16 mb-20 px-4 min-h-[60%]">

        <DashboardPage/>
    </section>
  )
}
