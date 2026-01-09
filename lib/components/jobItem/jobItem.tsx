"use client";
import React from "react";
import Image from "next/image";
import Button from "@/lib/components/button/button";
import { JobData } from "@/lib/types/componentTypes";
import locationIcon from "@/public/images/icons/location-grey.svg";
import saveIcon from "@/public/images/icons/archive.svg";
import defaultJobLogo from "@/public/images/logos/logo-joobly.svg";
import { useRouter } from "next/navigation";
import { useClient } from "@/lib/hooks/useClient";
import Skeleton from "@mui/material/Skeleton";
import DateConverter from "../dateConverter/DateConverter";

import DOMPurify from "dompurify";
import { truncateText } from "@/lib/constant/helpers";
import toast from "react-hot-toast";
import { slugify } from "@/lib/utils/slugify";

interface JobItem {
	data: JobData;
	favoriteJobIds?: string[];
	userLoggedIn?: boolean;
}
const JobItem = ({ data, favoriteJobIds, userLoggedIn }: JobItem) => {
	const { push } = useRouter();
	const isClient = useClient();
	const [isFavorite, setIsFavorite] = React.useState(favoriteJobIds?.includes(data._id!) ?? false);

	const handleAddFavorite = async (e: React.MouseEvent) => {
		if (!userLoggedIn) {
			push('/login');
			return;
		}

		e.stopPropagation();
		setIsFavorite(true);
		toast.success("Job added to favorites");

		try {
			await fetch("/api/favorite-jobs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ jobId: data._id }),
			});

		} catch (error) {
			setIsFavorite(false);
			console.log("Error adding favorite job:", error);
		}
	};

	const handleRemoveFavorite = async (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsFavorite(false);
		toast.success("Job removed from favorites");
		try {
			await fetch(`/api/favorite-jobs?_id=${data._id}`, {
				method: "DELETE",
			});
		} catch (error) {
			setIsFavorite(true);
			console.log("Error removing favorite job:", error);
		}
	};

	return (
		<>
			{isClient ? (
				<div key={data?._id} className="flex flex-col gap-6 justify-between bg-light rounded-lg mb-4 shadow-lg p-6 xl:flex-row lg:gap-8 cursor-pointer hover:shadow-xl duration-200">
					<div className="flex-shrink-0">
						<img
							src={data?.imageUrl || defaultJobLogo.src}
							alt={data.jobTitle || "Job image"}
							width={160}
							height={160}
							className="rounded-full object-contain w-24 h-24 md:w-40 md:h-40 mx-auto border border-gray-200 shadow"
						/>
					</div>
					<div onClick={() => {
						 const slug = slugify(data.jobTitle);
						 push(`/jobs/${slug}-${data._id}`);
					}} className="flex flex-col gap-6 justify-center">

						<div className="flex flex-col gap-6">
							<h4 className="font-bold text-lg text-dark">{data?.jobTitle}</h4>
							<div className="max-w-[700px]">
								{data?.description && isClient && (
									<p
										dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(data.description, 200)) }}
										className="text-base text-gray-600"
									/>
								)}
							</div>
						</div>
						{data.location && (
							<div className="flex items-center gap-5">
								<p className="flex items-center gap-2 text-gray-600 text-base">
									<span className="inline-block">
										<Image src={locationIcon} alt="location" />
									</span>
									{data?.location}
								</p>
							</div>
						)}
					</div>
					<div className="flex flex-col justify-between min-w-[150px]">
						<div className="flex justify-end gap-4 items-center">
							<span onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}>
								<Image
									src={saveIcon}
									alt="save"
									className="cursor-pointer"
									style={{ filter: isFavorite ? "invert(41%) sepia(77%) saturate(355%) hue-rotate(70deg) brightness(95%) contrast(92%)" : "grayscale(100%) brightness(80%)" }}
								/>
							</span>
							{/* <Image src={moreIcon} alt="more" className="cursor-pointer" /> */}
						</div>
						<div className="flex flex-col mt-4">
							<span className="self-end text-sm text-gray-500">{DateConverter({ mongoDate: data?.advertisedDate,format:"MM/DD/YYYY" })}</span>
							<div className="flex gap-2 mt-4 justify-end">
								<Button
									className="bg-[#c5f06d] text-gray-800  font-bold text-lg hover:bg-[#006c53] hover:text-white px-6 py-2 rounded-2xl flex gap-1 items-center duration-200"
									hoverIcon="/images/icons/list-white.svg"
								>
									<a target="_blank" href={data?.jobUrl} className="text-inherit">
										Apply Now
									</a>
								</Button>
							</div>
						</div>
					</div>
				</div>
			) : (
				<Skeleton
					key={data?._id}
					animation='wave'
					sx={{ width: "100%", background: "white" }}
					height={200}
				/>
			)}
		</>
	);
};

export default JobItem;
