"use client";
import React, { useState } from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Paper from "@/lib/components/paper/Paper";
import styles from "./deatilsContainer.module.scss";
import saveIcon from "@/public/images/icons/archive.svg";
import shareButton from "@/public/images/icons/shareButton.svg";
import Button from "@/lib/components/button/button";
import Divider from "@/lib/components/devider/divider";
import KeyValueComponent from "@/lib/components/keyValueComponent/keyValueComponent";
import { useRouter } from "next/navigation";
import { useClient } from "@/lib/hooks/useClient";
import DateConverter from "../dateConverter/DateConverter";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useProfile } from "@/lib/hooks/useProfile";
import Image from "next/image";
import defaultJobLogo from "@/public/images/logos/company-placeholder.svg";
import RelatedJobs from "./RelatedJobs";

const DetailsContainer = ({ data }: any) => {
	const session = useSession();
	const profile = useProfile();
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const currentUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
	const userData = session.data?.user as UserTypes;
	const { back } = useRouter();
	const isClient = useClient();

	const isJobFavorite = React.useMemo(() => {
		if (!profile?.data?.favoriteJobs) return false;
		return profile.data.favoriteJobs.some(
			(fav: any) => fav._id === data._id
		);
	}, [profile?.data?.favoriteJobs, data?._id]);

	const [isFavorite, setIsFavorite] = useState(isJobFavorite);

	// Sincronizar el estado si cambian los favoritos o el job
	React.useEffect(() => {
		setIsFavorite(isJobFavorite);
	}, [isJobFavorite]);

	const socialPlatforms = [
		{
			name: 'share in Facebook',
			url: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
		},
		{
			name: 'share in Twitter',
			url: `https://twitter.com/intent/tweet?url=${currentUrl}`,
		},
		{
			name: 'share in LinkedIn',
			url: `https://www.linkedin.com/shareArticle?url=${currentUrl}`,
		},
		{
			name: 'share in WhatsApp',
			url: `https://api.whatsapp.com/send?text=${currentUrl}`,
		},
	];


	const jobDetails = [
		{
			key: "Job Role",
			value: data?.jobTitle || "N/A",
		},
		{
			key: "Contract Type",
			value: data?.workType || "N/A",
		},
		{
			key: "Salary",
			value: data?.salary ? `${data?.salary} ${data?.currency}` : "N/A",
		},
		{
			key: "Experience Level",
			value: data?.experienceLevel || "N/A",
		},
		{
			key: "Education",
			value: data?.education || "N/A",
		},
		{
			key: "Working Hours",
			value: data?.jobTime || "N/A",
		},
		{
			key: "Work Location",
			value: `${data?.location}${data?.country?.label ? "," + data?.country?.label : ""}` || "N/A",
		},
	];

	const companyInfo = [
		{
			key: "Company",
			value: data?.companyDetails?.ceoCompany || "N/A",
		},
		{
			key: "Founded",
			value: data?.companyDetails?.founded || "N/A",
		},
		{
			key: "Company Size",
			value: data?.companyDetails?.companySize || "N/A",
		},
	];

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	async function handleDeleteClick() {

		setIsFavorite(false);

		const res = await fetch('/api/favorite-jobs?_id=' + data._id, {
			method: 'DELETE',
		});
		if (res.ok) {
			toast.success('Job removed from favorites!');
			setIsFavorite(false);
		} else {
			toast.error("Failed to remove job from favorites");
		}
	}

	async function addJobToFavorite() {
		setIsFavorite(true);

		if (!userData.email) {
			toast((t) => (
				<div className="flex flex-col gap-4 text-[#a80202] text-center items-center mb-2">
					<span className="font-medium">
						To add the job to favorite, you need to be logged in
					</span>
				</div>
			));
			return;
		}

		try {
			const response = await fetch("/api/favorite-jobs", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ jobId: data._id }),
			});

			const result = await response.json();

			if (response.ok) {
				setIsFavorite(true);
				toast.success('Job added to favorites!');
			} else {
				setIsFavorite(false);
				toast.error(result.error || result.message || "Failed to add job");
			}
		} catch (error) {
			setIsFavorite(false);
			toast.error("An unexpected error occurred");
			console.error(error);
		}
	}

	return (
		<>
			{isClient && (
				<div className={styles["job-details-page"]}>
					<div className={styles["job-details-wrapper"]} >
						<Paper className='details-component-paper'>
							<section className={styles["job-details-page-info"]}>
								<div className={styles["job-details-page-actions"]}  style={{marginTop:0}}>
									{/* share popup start */}
									{isDropdownOpen && (
										<div
											onClick={toggleDropdown}
											className="absolute top-0 left-0 w-screen h-screen">
											<div
												onClick={toggleDropdown}
												className="absolute mt-2 bg-white top-[22%] 
										left-[39%] sml:left-[58%] sml:left-[73%] lg:left-[58%] 
										border border-gray-300 rounded shadow-lg z-10">
												<ul className="p-2 space-y-2">
													{socialPlatforms?.map((platform) => (
														<li key={platform.name}>
															<a
																href={platform.url}
																target="_blank"
																rel="noopener noreferrer"
																className="block text-gray-500 hover:text-[#a80202] duration-200"
															>
																{platform.name}
															</a>
														</li>
													))}
												</ul>
											</div>
										</div>
									)}
									{userData &&
										<div className="flex justify-end gap-4 items-center">
											<span onClick={isFavorite ? handleDeleteClick : addJobToFavorite}>
												<Image
													src={saveIcon}
													alt="save"
													className="cursor-pointer"
													style={{ filter: isFavorite ? "invert(41%) sepia(77%) saturate(355%) hue-rotate(70deg) brightness(95%) contrast(92%)" : "grayscale(100%) brightness(80%)" }}
												/>
											</span>
										</div>
									}
									<Image
										onClick={toggleDropdown}
										className="cursor-pointer"
										alt='share button'
										src={shareButton}
										width={44}
										height={44}
									/>
								</div>
								<div className={styles["job-general-details"]} style={{marginTop:0}}>
									<div className="flex flex-col items-center justify-center w-full gap-4 pb-4">
										{/* <img
											src={data?.imageUrl || defaultJobLogo}
											alt={data.jobTitle || "Job image"}
											className="rounded-lg object-cover shadow-md w-60 sm:w-80 md:w-full max-w-md mb-2"
										/> */}
										<p className={styles["job-general-job-title"] + " text-center text-xl font-semibold mt-2 mb-2"}>{data?.jobTitle}</p>
										<div className={styles["job-general-buttons"] + " flex justify-center w-full"}>
											<a href={data?.jobUrl} target='_blank' rel='noopener noreferrer'>
												<Button
													style={{ width: "145px" }}
													className={`btn-secondary-search`}
													hoverIcon='/jobs/images/icons/list-white.svg'
												>
													Apply Now
												</Button>
											</a>
										</div>
									</div>
								</div>
								<Divider />
								<KeyValueComponent data={jobDetails || []} />
								<div className={styles["job-description"]}>
									<p className={styles["job-description-title"]}>Job Description</p>
									<p
										dangerouslySetInnerHTML={{ __html: data?.description }}
										className={styles["job-description-content"]}
									/>
								</div>
								<Divider />
								<div className={styles["job-check-details"]}>
									<p>
										Please check the information above before applying for a job <span>*</span>
									</p>
								</div>
							</section>
						</Paper>
						<div className='details-component-paper'>
						{data?.companyDetails?.ceoCompany && (
							<Paper className='details-component-paper' style={{marginBottom:"10px"}}>
								<section className={styles["job-company-details"]} style={{marginTop:0,marginBottom:0}}>
									
									 <div className={styles["key-value-wrapper"]} style={{  }}>
											  <p className={styles["key"]} style={{fontWeight:"600"}}>
												Company :
											  </p>
											  <p className={styles["value"]}>
												{data?.companyDetails?.ceoCompany || "N/A"}
											  </p>
									</div>

									{data.companyDetails.companyWebsite && 
										<div className={styles["key-value-wrapper"]} style={{marginTop:"20px"  }}>
												<a href={data.companyDetails.companyWebsite}
											    	target="_blank" 
												    className={styles["key"]} style={{display:"flex",alignItems:"center",gap:"5px"}}
												>
													<OpenInNewIcon/>
													Website
												</a>
												
										</div>
									}
								</section>
							</Paper>
						)}
						 {data?.companyDetails?.ceoCompany ? (
							<RelatedJobs companyName={data?.companyDetails?.ceoCompany} currentJobId={data._id} />
					    	):<Paper className='details-component-paper' >
								<section className={styles["job-company-details"]}>
								     <h2 className="text-md text-center font-semibold text-slate-800 mb-5 flex items-center gap-2">
										 No Related Jobs Found
									 </h2>
								</section>
							</Paper>} 
						</div>
					</div>
					<div className={styles["job-details-bottom-buttons"]}>
						<Button
							onClick={() => back()}
							style={{ width: "185px", height: "46px" }}
							className={`btn-green-outlined`}
						>
							Back
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default DetailsContainer;
