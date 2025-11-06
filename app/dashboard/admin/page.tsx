import AdminUsersJobs from "@/lib/components/dashboard/AdminUsersJobs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Joobly | Profile",
    description: "My favorite vacancy",
};


export default function AdminDashboard() {
  return (
    <section className="mt-16 mb-20 px-4 min-h-[60%]">
        <AdminUsersJobs/>
    </section>
  )
}
