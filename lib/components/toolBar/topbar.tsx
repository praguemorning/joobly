"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface TopbarProps {
	filterOptions: {
		locations: any[];
		languages: any[];
		workTypes: any[];
		jobCategories: any[];
		jobTimes: any[];
		educations: any[];
		salary: any[];
		experienceLevels: any[];
	};
	initialFilters?: Record<string, string>;
}

const Topbar: React.FC<TopbarProps> = ({ filterOptions, initialFilters }) => {
	const router = useRouter();
	const [filters, setFilters] = useState({
		jobTitle: initialFilters?.jobTitle || "",
		location: initialFilters?.location || "",
		language: initialFilters?.language || "",
		workType: initialFilters?.workType || "",
		jobCategory: initialFilters?.jobCategory || "",
		education: initialFilters?.education || "",
		jobTime: initialFilters?.jobTime || "",
		salary: initialFilters?.salary || "",
		experienceLevel: initialFilters?.experienceLevel || "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
		setFilters({ ...filters, [e.target.name]: e.target.value });
	};

	const handleSearch = () => {
		const params = new URLSearchParams(filters as any).toString();
		router.push(`/?${params}`);
	};

	const ArrowIcon = () => (
		<svg className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg>
	);

	const renderSelect = (props: { name: string; value: string; onChange: any; options: any[]; label: string; }) => (
		<div className="relative min-w-[150px] w-full">
			<select
				name={props.name}
				value={props.value}
				onChange={props.onChange}
				className="border rounded px-3 py-2 w-full appearance-none"
			>
				<option value="">{props.label}</option>
				{props.options.map((opt) => (
					<option key={opt.id} value={opt.label}>{opt.label}</option>
				))}
			</select>
			<ArrowIcon />
		</div>
	);

	return (
		<div className="bg-white rounded-xl shadow p-4 mb-6 max-h-[550px]">
			<div className="gap-4 items-center flex flex-wrap w-full lg:max-w-[300px]">
				{/* <input
					type="text"
					name="jobTitle"
					value={filters.jobTitle}
					onChange={handleChange}
					placeholder="Search by job title..."
					className="border rounded px-3 py-2 min-w-[150px] w-full"
				/> */}
				{renderSelect({ name: "location", value: filters.location, onChange: handleChange, options: filterOptions.locations, label: "Location" })}
				{renderSelect({ name: "language", value: filters.language, onChange: handleChange, options: filterOptions.languages, label: "Language" })}
				{renderSelect({ name: "workType", value: filters.workType, onChange: handleChange, options: filterOptions.workTypes, label: "Work Type" })}
				{renderSelect({ name: "jobCategory", value: filters.jobCategory, onChange: handleChange, options: [{id: "", label: "Hospitality & Food"},...filterOptions.jobCategories], label: "Category" })}
				{renderSelect({ name: "education", value: filters.education, onChange: handleChange, options: filterOptions.educations, label: "Education" })}
				{renderSelect({ name: "jobTime", value: filters.jobTime, onChange: handleChange, options: filterOptions.jobTimes, label: "Job Time" })}
				{renderSelect({ name: "salary", value: filters.salary, onChange: handleChange, options: filterOptions.salary, label: "Salary Range" })}
				{renderSelect({ name: "experienceLevel", value: filters.experienceLevel, onChange: handleChange, options: filterOptions.experienceLevels, label: "Experience" })}
			</div>
			<button
				onClick={handleSearch}
				className="bg-[#006c53] text-white px-6 py-2 rounded-xl hover:bg-[#004d3c] transition font-bold mt-4 w-full"
			>
				Search
			</button>
		</div>
	);
};

export default Topbar;