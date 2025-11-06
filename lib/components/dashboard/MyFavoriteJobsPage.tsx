"use client"
import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useProfile } from "@/lib/hooks/useProfile";
import { UserProfileTypes } from "@/models/User";

import { FaUser } from "react-icons/fa";
import Link from "next/link";
import FavoriteJobPostItem from "./FavoriteJobPostItem";

const MyFavoriteJobsPage = () => {
  const session = useSession();


  const { status } = session;
  const profile = useProfile();
  const jobs = profile.data.favoriteJobs;

  const { email, image, name } = (profile.data as UserProfileTypes);
  const isAdmin = profile?.data?.admin;


  const [showAll, setShowAll] = useState(false);

  if (profile.loading) {
    return (
      <div className="container mx-auto">
        loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return redirect('/');
  }

  const visibleJobs = showAll ? jobs : jobs?.slice(0, 5);

  return (
    <div className="container mx-auto flex flex-col lg:flex-row">
      <div className="bg-light rounded-lg shadow-[0_4px_120px_rgba(151,159,183,0.15)] py-4 px-6 min-w-[300px] h-[520px]">
        <div>
          {image ? (
            <Image src={image} width={100} height={100} alt="user image" className="rounded-xl" />
          ) : (
            <div className="w-24 h-24 border-2 border-[#006c53] rounded-xl flex items-center justify-center">
              <FaUser className="text-[#006c53] w-16 h-16" />
            </div>
          )}
        </div>
        <div className="flex flex-col text-gray-500">
          <div>name: <span>{name}</span></div>
          <div>email: <span>{email}</span></div>
        </div>
        <Link
          className="mt-4 font-bold text-lg border-2 text-center bg-white border-[#006c53] hover:border-[#83cfbe] text-black text px-4 py-2 rounded-2xl flex items-center duration-200"
          href={'/dashboard'}
        >
          Job postings
        </Link>
        {isAdmin && (
          <Link
            className="mt-4 font-bold text-lg border-2 text-center bg-white border-[#006c53] hover:border-[#83cfbe] text-black text px-4 py-2 rounded-2xl flex items-center duration-200"
            href={'/dashboard/admin'}
          >
            Admin Area
          </Link>
        )}
      </div>
      <div className="px-0 md:px-2 mdl:px-6 flex-grow">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 py-2 h-14 mt-4 lg:mt-0">
          <p className=" text-gray-600 text-sm md:text-xl">
            {jobs?.length > 0 ? jobs.length : "no"} favorite {jobs?.length > 1 ? "jobs" : "job"}
          </p>
        </div>

        <div className="space-y-4">
          <Suspense fallback={<div>Loading...</div>}>
            {visibleJobs?.map((result: any) => (
              <FavoriteJobPostItem data={result} key={result._id} />
            ))}
          </Suspense>

          {/* Show more button */}
          {!showAll && jobs?.length > 5 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAll(true)}
                className="px-6 py-2 bg-[#006c53] text-white rounded-xl hover:bg-[#004d3c] transition"
              >
                Show more
              </button>
            </div>
          )}

          {/* Background section */}
          <div className="relative mt-16 h-[361px] bg-cover bg-center rounded-lg flex flex-col items-center justify-center text-center"
            style={{ backgroundImage: "url('/images/green-bg-search.svg')" }}
          >
            <h5 className="text-4xl font-bold tracking-wider text-light">
              Join our Job group on Facebook
            </h5>
            <a
              href="https://www.facebook.com/groups/jobsinpragueforeigners---"
              target="_blank"
              className="mt-5 px-8 py-4 bg-dark text-light font-bold text-xl rounded-lg hover:opacity-80"
            >
              Join Here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFavoriteJobsPage;