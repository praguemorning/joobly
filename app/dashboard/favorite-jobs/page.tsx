import MyFavoriteJobsPage from "@/lib/components/dashboard/MyFavoriteJobsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Profile",
	description: "My favorite vacancy",
};


export default function FavoriteJobs() {
  return (
    <section className="mt-16 mb-20 px-4 min-h-[60%]">
        <MyFavoriteJobsPage/>
    </section>
  )
}
