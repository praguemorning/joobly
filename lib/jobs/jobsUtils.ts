import { BACKEND_URL } from "@/lib/constant/constants";
import { JobData, optionItems } from "@/lib/types/componentTypes";
import { uniqueArray } from "@/lib/utils/uniqueArray/uniqueArray";
import { cookies } from "next/headers";

export async function processOptions(options: JobData[]) {
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

export async function getData(params: any) {
    const cookieStore = cookies();
    const cookie = cookieStore.toString();

    const res = await fetch(`${BACKEND_URL}/jobs?${params}`, {
        headers: {
            cookie,
        },
        next: { revalidate: 60 },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

export async function getOptions() {
    const cookieStore = cookies();
    const cookie = cookieStore.toString();

    const res = await fetch(`${BACKEND_URL}/job-options`, {
        headers: {
            cookie,
        },
        next: { revalidate: 60 },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}

export async function getItem(id: string) {
    try {
        const res = await fetch(`${BACKEND_URL}/jobs/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("Failed to fetch job item");
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching job item:", error);
        return null;
    }
}