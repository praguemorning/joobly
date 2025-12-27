import { getUserFavsJobs, getUserInfo } from "@/lib/user/getUserFavsJobs";
import { JobsPagePropsTypes } from "@/lib/types/componentTypes";
import { processOptions, getData, getOptions } from "@/lib/jobs/jobsUtils";
import HeaderBackground from "@/lib/components/headerBackground/headerBackground";
import JobItem from "../../lib/components/jobItem/jobItem";
import React, { Suspense } from "react";
import Topbar from "../../lib/components/toolBar/topbar";

const Jobs = async ({ searchParams }: JobsPagePropsTypes) => {
	const normalizedFilters: Record<string, string> = {
		jobTitle: searchParams?.jobTitle ?? "",
		location: searchParams?.location ?? "",
		language: searchParams?.language ?? "",
		workType: searchParams?.workType ?? "",
		jobCategory: searchParams?.jobCategory ?? "",
		education: searchParams?.education ?? "",
		jobTime: searchParams?.jobTime ?? "",
		salary: searchParams?.salary ?? "",
		experienceLevel: searchParams?.experienceLevel ?? "",
	};

	const favoriteJobIds = await getUserFavsJobs();
	const user = await getUserInfo();
	const params = new URLSearchParams(normalizedFilters);
	const [jobs, options] = await Promise.all([getData(params), getOptions()]);
	const { locations, languages, workTypes, jobTimes, educations, salary, experienceLevels, jobCategories } = await processOptions(options);
	
	return (
		<>
			<HeaderBackground />
			<section className="mt-16 mb-20 px-4">
				<div className="container mx-auto flex flex-col lg:flex-row">
					<Topbar
						filterOptions={{
							locations,
							languages,
							workTypes,
							jobCategories,
							jobTimes,
							educations,
							salary,
							experienceLevels,
						}}
						initialFilters={normalizedFilters}
					/>
					<div className="px-0 md:px-2 mdl:px-6 flex-grow">
						<div className="flex items-center justify-between mb-6 py-4 px-2 h-14">
							<h3 className="text-2xl text-gray-600">
								{jobs?.length || "No"} {jobs?.length > 1 ? "jobs" : "job"} found
							</h3>
						</div>

						<div className="space-y-4">
							<Suspense fallback={<div>Loading...</div>}>
								{jobs.jobs?.map((result: any) => (
									<JobItem data={result} favoriteJobIds={favoriteJobIds} key={result._id} userLoggedIn={!!user} />
								))}
							</Suspense>
						</div>

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
			</section>
		</>
	);
};

export default Jobs;
