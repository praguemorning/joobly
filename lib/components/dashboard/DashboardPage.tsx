"use client"
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { useProfile } from "@/lib/hooks/useProfile";
import { UserProfileTypes } from "@/models/User";
import Button from "@/lib/components/button/button";

import { FaUser } from "react-icons/fa";
import Link from "next/link";
import MyJobPostItem from "./MyJobPostItem";

const DashboardPage = () => {
  const [jobs, setJobs] = useState<any>([]);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const session = useSession();
  const router = useRouter();


  const { status } = session;
  const profile = useProfile();

  const { email, image, name, jobPostPoints } = (profile.data as UserProfileTypes);
  const userId = profile?.data?._id;
  const isAdmin = profile?.data?.admin;

  useEffect(() => {
    if (userId) {
      fetch(`/api/my-jobs/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setJobs(data);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
          setJobs([]);
        });
    }
  }, [userId])

  function HandleCheckJobPostPoints() {
    if (jobPostPoints <= 0) {
      toast((t) => (
        <span className="flex flex-col gap-4 text-[#a80202] text-center items-center mb-2">
          <span className="font-medium">
            You don&apos;t have enough points to post a job.
          </span>
          <button onClick={() => toast.dismiss(t.id)}>
            <Link
              className="bg-[#a80202] text-white px-4 py-2 border 
                hover:bg-white hover:text-[#a80202] border-[#a80202] 
                rounded-xl duration-300"
              href={'/payment'}
            >
              Buy more
            </Link>
          </button>
        </span>
      ));
    } else {
      router.push('/post-job');
    }
  }

  if (status === "unauthenticated") {
    return redirect('/');
  }

  return (
    <div className="container mx-auto flex flex-col lg:flex-row">
      <div className="bg-light rounded-lg shadow-[0_4px_120px_rgba(151,159,183,0.15)] py-6 px-8 min-w-[320px] h-[520px] flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {image ? (
              <Image src={image} width={110} height={110} alt="user image" className="rounded-full border-4 border-[#e3e4e8] shadow-lg" />
            ) : (
              <div className="w-28 h-28 border-4 border-[#e3e4e8] rounded-full flex items-center justify-center bg-gray-100 shadow-lg">
                <FaUser className="text-[#a80202] w-16 h-16" />
              </div>
            )}
          </div>
          <div className="mt-2 text-center">
            <div className="font-bold text-lg text-[#a80202]">{name}</div>
            <div className="text-gray-500 text-sm">{email}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full mt-4">
          <Link
            className="font-bold text-lg border-2 text-center bg-white border-[#a80202] hover:border-[#e3e4e8] text-black px-4 py-2 rounded-2xl flex items-center justify-center duration-200"
            href={'/dashboard'}
          >
            <span className="mr-2">📄</span> Job postings
          </Link>
          <Link
            className="font-bold text-lg border-2 text-center bg-white border-[#a80202] hover:border-[#e3e4e8] text-black px-4 py-2 rounded-2xl flex items-center justify-center duration-200"
            href={'/dashboard/favorite-jobs'}
          >
            <span className="mr-2">⭐</span> Favorite Jobs
          </Link>
          {isAdmin && (
            <Link
              className="font-bold text-lg border-2 text-center bg-white border-[#a80202] hover:border-[#e3e4e8] text-black px-4 py-2 rounded-2xl flex items-center justify-center duration-200"
              href={'/dashboard/admin'}
            >
              <span className="mr-2">🛠️</span> Admin Area
            </Link>
          )}
        </div>
      </div>
      <div className="px-0 md:px-2 mdl:px-6 flex-grow">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 py-2 mt-4 lg:mt-0 gap-8">
          <p className=" text-gray-600 text-xl">
            {jobPostPoints} job post {jobPostPoints === 1 ? "point" : "points"} remaining
          </p>
          <Button
            onClick={() => HandleCheckJobPostPoints()}
            className="bg-gray-200 text-gray-500 font-bold text-lg border-2  hover:bg-white hover:border-[#a80202] hover:text-black text px-4 py-1 rounded-2xl flex items-center duration-200"
          >
            Create job post
          </Button>
        </div>

        <div className="space-y-4">
          {/*your job posts*/}
          <Suspense fallback={<div>Loading...</div>}>
            {(showAllJobs ? jobs : jobs.slice(0, 5)).map((result: any) => (
              <MyJobPostItem data={result} key={result._id} />
            ))}
          </Suspense>
          {jobs.length > 5 && !showAllJobs && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setShowAllJobs(true)}
                className="bg-[#a80202] text-white px-4 py-2 rounded-xl hover:bg-[#004c3b] transition"
              >
                Show more
              </Button>
            </div>
          )}
          <div className="relative mt-16 h-[361px] bg-cover bg-center rounded-lg flex flex-col items-center justify-center text-center"
            style={{ backgroundImage: "url('/images/green-bg-search.svg')" }}
          >
            <h5 className="text-4xl font-bold tracking-wider text-light">
              Join our Job group on Facebook
            </h5>
            <a href="https://www.facebook.com/groups/jobsinpragueforeigners---"
              target="_blank"
              className="mt-5 px-8 py-4 bg-dark text-light font-bold text-xl rounded-lg hover:opacity-80"
            >
              Join Here
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage;


