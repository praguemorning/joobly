"use client";

import { JOB_CATEGORIES } from "@/lib/constant/jobCategories";
import { LANGUAGES, EXPERIENCE_LEVELS, JOB_TYPES, SALARY_BANDS } from "@/lib/constant/filters";
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
		jobType: initialFilters?.jobType || "",
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

	const renderSelect = (props: { name: string; value: string; onChange: any; options: any[]; label: string; placeholder?: string; }) => (
		<div className="relative min-w-[150px] w-full">
			<select
				name={props.name}
				value={props.value}
				onChange={props.onChange}
				className="border rounded px-3 py-2 w-full appearance-none"
			>
				<option value="">{props.placeholder ?? props.label}</option>
				{props.options.map((opt) => (
					<option key={opt.id} value={opt.label}>{opt.label}</option>
				))}
			</select>
			<ArrowIcon />
		</div>
	);

	return (
		<div className="jobs-filter-panel bg-white rounded-xl shadow p-4 mb-6 max-h-[550px]">
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
				{renderSelect({ name: "language", value: filters.language, onChange: handleChange, options: LANGUAGES.map((label) => ({ id: label, label })), label: "Language" })}
				{renderSelect({ name: "workType", value: filters.workType, onChange: handleChange, options: filterOptions.workTypes, label: "Work Type" })}
				{renderSelect({ name: "jobCategory", value: filters.jobCategory, onChange: handleChange, options: JOB_CATEGORIES.map((label) => ({ id: label, label })), label: "Category", placeholder: "All Categories" })}
				{renderSelect({ name: "education", value: filters.education, onChange: handleChange, options: filterOptions.educations, label: "Education" })}
				{renderSelect({ name: "jobType", value: filters.jobType, onChange: handleChange, options: JOB_TYPES.map((label) => ({ id: label, label })), label: "Job Type" })}
				{renderSelect({ name: "salary", value: filters.salary, onChange: handleChange, options: SALARY_BANDS.map((label) => ({ id: label, label })), label: "Salary Range" })}
				{renderSelect({ name: "experienceLevel", value: filters.experienceLevel, onChange: handleChange, options: EXPERIENCE_LEVELS.map((label) => ({ id: label, label })), label: "Experience" })}
			</div>
			<button
				onClick={handleSearch}
				className="bg-[#a80202] text-white px-6 py-2 rounded-xl hover:bg-[#004d3c] transition font-bold mt-4 w-full"
			>
				Search
			</button>
		</div>
	);
};

export default Topbar;