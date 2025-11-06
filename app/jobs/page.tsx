import React, { Suspense } from "react";
import Topbar from "../../lib/components/toolBar/topbar";
import JobItem from "../../lib/components/jobItem/jobItem";
import { JobData, JobsPagePropsTypes, optionItems } from "@/lib/types/componentTypes";
import { uniqueArray } from "@/lib/utils/uniqueArray/uniqueArray";
import HeaderBackground from "@/lib/components/headerBackground/headerBackground";
import { BACKEND_URL } from "@/lib/constant/constants";

export const dynamic = "force-dynamic";

async function processOptions(options: JobData[]) {
	const processedOptions = options.reduce(
		(acc, item) => {
			if (item.location) {
				acc.locations.push({ id: item._id!, label: item.location });
			}
			if (item.language) {
				acc.languages.push({ id: item._id!, label: item.language });
			}
			if (item.education) {
				acc.educations.push({ id: item._id!, label: item.education });
			}
			if (item.workType) {
				acc.workTypes.push({ id: item._id!, label: item.workType });
			}
			if (item.jobCategory) {
				acc.jobCategories.push({ id: item._id!, label: item.jobCategory });
			}
			if (item.jobTime) {
				acc.jobTimes.push({ id: item._id!, label: item.jobTime });
			}
			if (item.experienceLevel) {
				acc.experienceLevels.push({ id: item._id!, label: item.experienceLevel });
			}
			if (item.salaryLabel) {
				acc.salaryLabels.push({ id: item._id!, label: item.salaryLabel });
			}


			return acc;
		},
		{
			locations: [] as optionItems[],
			languages: [] as optionItems[],
			educations: [] as optionItems[],
			workTypes: [] as optionItems[],
			jobCategories: [] as optionItems[],
			jobTimes: [] as optionItems[],
			salaryLabels: [] as optionItems[],
			experienceLevels: [] as optionItems[],
		},
	);

	return {
		locations: uniqueArray(processedOptions.locations),
		languages: uniqueArray(processedOptions.languages),
		educations: uniqueArray(processedOptions.educations),
		workTypes: uniqueArray(processedOptions.workTypes),
		jobCategories: uniqueArray(processedOptions.jobCategories),
		jobTimes: uniqueArray(processedOptions.jobTimes),
		salaryLabels: uniqueArray(processedOptions.salaryLabels),
		experienceLevels: uniqueArray(processedOptions.experienceLevels),
	};
}

async function getData(params: any) {
	const res = await fetch(`${BACKEND_URL}/jobs?${params}`, {
		next: { revalidate: 60 },
	});
	if (!res) {
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

async function getOptions() {
	const res = await fetch(`${BACKEND_URL}/job-options`, {
		next: { revalidate: 60 },
	});

	if (!res.ok) {
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

const Jobs = async ({ searchParams }: JobsPagePropsTypes) => {
	const params = new URLSearchParams({
		jobTitle: searchParams?.jobTitle || "",
		location: searchParams?.location || "",
		language: searchParams?.language || "",
		workType: searchParams?.workType || "",
		jobCategory: searchParams?.jobCategory || "",
		education: searchParams?.education || "",
		jobTime: searchParams?.jobTime || "",
		salaryLabel: searchParams?.salaryLabel || "",
		experienceLevel: searchParams?.experienceLevel || "",
	});
	const [jobs, options] = await Promise.all([getData(params), getOptions()]);


	const { locations, languages, workTypes, jobTimes, educations, salaryLabels, experienceLevels, jobCategories } = await processOptions(options);

	const defaultLocation = locations.find((item) => item.label === searchParams?.location);
	const defaultLanguage = languages.find((item) => item.label === searchParams?.language);
	const defaultWorkType = workTypes.find((item) => item.label === searchParams?.workType);
	const defaultJobCategory = jobCategories.find((item) => item.label === searchParams?.jobCategory);
	const defaultSalaryLabel = salaryLabels.find((item) => item.label === searchParams?.salaryLabel);
	const defaultJobTime = jobTimes.find((item) => item.label === searchParams?.jobTime);
	const defaultEducation = educations.find((item) => item.label === searchParams?.education);
	const defaultExperienceLevel = experienceLevels.find((item) => item.label === searchParams?.experienceLevel);

	return (
		<>
			<HeaderBackground />
			<section className="mt-16 mb-20 px-4">
				<div className="container mx-auto flex flex-col lg:flex-row">
					<Topbar
						defaultJobSearchValue={searchParams?.jobTitle}
						defaultLocation={defaultLocation?.id}
						defaultLanguage={defaultLanguage?.id}
						defaultEducation={defaultEducation?.id}
						defaultWorkType={defaultWorkType?.id}
						defaultJobCategory={defaultJobCategory?.id}
						defaultExperienceLevel={defaultExperienceLevel?.id}
						defaultSalary={defaultSalaryLabel?.id}
						defaultJobTime={defaultJobTime?.id}
						locations={locations}
						languages={languages}
						educations={educations}
						workType={workTypes}
						jobCategories={jobCategories}
						jobTime={jobTimes}
						experienceLevel={experienceLevels}
						salary={salaryLabels}
					/>
					<div className="px-0 md:px-2 mdl:px-6 flex-grow">
						<div className="flex items-center justify-between mb-6 py-2 h-14">
							<p className="text-xl text-gray-600">
								{jobs?.length || "No"} {jobs?.length > 1 ? "jobs" : "job"} found
							</p>
						</div>

						<div className="space-y-4">
							<Suspense fallback={<div>Loading...</div>}>
								{jobs.jobs?.map((result: any) => (
									<JobItem data={result} key={result._id} />
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
