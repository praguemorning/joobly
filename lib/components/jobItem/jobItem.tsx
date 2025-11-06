"use client";
import React from "react";
import Image from "next/image";
import Button from "@/lib/components/button/button";
import { JobData } from "@/lib/types/componentTypes";
import locationIcon from "@/public/images/icons/location-grey.svg";
import moneyIcon from "@/public/images/icons/dollar-circle.svg";
import moreIcon from "@/public/images/icons/more.svg";
import saveIcon from "@/public/images/icons/archive.svg";
import { useRouter } from "next/navigation";
import { useClient } from "@/lib/hooks/useClient";
import Skeleton from "@mui/material/Skeleton";
import DateConverter from "../dateConverter/DateConverter";

import DOMPurify from "dompurify";
import { truncateText } from "@/lib/constant/helpers";

interface JobItem {
	data: JobData;
}
const JobItem = ({ data }: JobItem) => {
	const { push } = useRouter();
	const isClient = useClient();



	return (
		<>
			{isClient ? (
				<div key={data?._id} className="flex flex-col gap-6 justify-between bg-light rounded-lg mb-4 shadow-lg p-6 xl:flex-row lg:gap-8">
					<div className="flex flex-col gap-6">
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
						<div className="flex items-center gap-5">
							<p className="flex items-center gap-2 text-gray-600 text-base">
								<span className="inline-block">
									<Image src={locationIcon} alt="location" />
								</span>
								{data?.location}
							</p>
							{
								/*
								<p className="flex items-center gap-1 text-dark font-semibold text-base">
									<span className="inline-block">
										CZK
									</span>
									{data?.salary}
									<span className="text-gray-600 font-normal">/{data?.salaryDetail}</span>
								</p>
								*/
							}

						</div>
					</div>
					<div className="flex flex-col justify-between">
						<div
							onClick={() => push(`/jobs/${data?._id}`)}
							className="flex justify-end gap-4 items-center">
							<Image src={saveIcon} alt="save" className="cursor-pointer" />
							<Image src={moreIcon} alt="more" className="cursor-pointer" />
						</div>
						<div className="flex flex-col mt-4">
							<span className="self-end text-sm text-gray-500">{DateConverter({ mongoDate: data?.advertisedDate })}</span>
							<div className="flex gap-2 mt-4">
								<Button
									className="bg-[#c5f06d] text-gray-800  font-bold text-lg hover:bg-[#006c53] hover:text-white px-6 py-2 rounded-2xl flex gap-1 items-center duration-200"
									icon="/images/icons/list.svg"
									hoverIcon="/images/icons/list-white.svg"
								>
									<a target="_blank" href={data?.jobUrl} className="text-inherit">
										Apply Now
									</a>
								</Button>
								{
									/*
									<Button
									onClick={() => push(`/jobs/${data?._id}`)}
									className="bg-gray-200 text-gray-500 font-bold text-lg border-2  hover:bg-white hover:border-[#006c53] hover:text-black text px-4 py-2 rounded-2xl flex items-center duration-200"
									>
										Detail Information
									</Button>
									*/
								}
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
