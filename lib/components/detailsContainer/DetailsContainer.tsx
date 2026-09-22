"use client";
import React, { useState } from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Paper from "@/lib/components/paper/Paper";
import styles from "./deatilsContainer.module.scss";
import saveIcon from "@/public/images/icons/archive.svg";
import Button from "@/lib/components/button/button";
import Divider from "@/lib/components/devider/divider";
import KeyValueComponent from "@/lib/components/keyValueComponent/keyValueComponent";
import { useRouter } from "next/navigation";
import { useClient } from "@/lib/hooks/useClient";
import DateConverter from "../dateConverter/DateConverter";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useProfile } from "@/lib/hooks/useProfile";
import Image from "next/image";
import defaultJobLogo from "@/public/images/logos/company-placeholder.svg";
import RelatedJobs from "./RelatedJobs";
import ShareMenu from "@/lib/components/shareMenu/shareMenu";
import { hasValue } from "@/lib/jobs/hasValue";
import { isFeaturedActive } from "@/lib/jobs/featured";

const DetailsContainer = ({ data }: any) => {
	const { isSignedIn } = useAuth();
	const profile = useProfile();
	const shareUrl = typeof window !== "undefined" ? window.location.href : "";
	const { back } = useRouter();
	const isClient = useClient();
	const featured = isFeaturedActive(data);

	const isJobFavorite = React.useMemo(() => {
		if (!profile?.data?.favoriteJobs) return false;
		return profile.data.favoriteJobs.some(
			(fav: any) => fav._id === data._id
		);
	}, [profile?.data?.favoriteJobs, data?._id]);

	const [isFavorite, setIsFavorite] = useState(isJobFavorite);

	React.useEffect(() => {
		setIsFavorite(isJobFavorite);
	}, [isJobFavorite]);

	const jobDetails = [
		{ key: "Job Role", value: data?.jobTitle || "N/A" },
		{ key: "Contract Type", value: data?.workType || "N/A" },
		{
			key: "Salary",
			value: hasValue(data?.salary) ? `${data.salary} ${data?.currency ?? ""}`.trim() : "N/A",
		},
		{ key: "Experience Level", value: data?.experienceLevel || "N/A" },
		{ key: "Education", value: data?.education || "N/A" },
		{ key: "Working Hours", value: data?.jobTime || "N/A" },
	];

	async function handleDeleteClick() {
		setIsFavorite(false);
		const res = await fetch('/jobs/api/favorite-jobs?_id=' + data._id, {
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

		if (!isSignedIn) {
			toast(() => (
				<div className="flex flex-col gap-4 text-[#a80202] text-center items-center mb-2">
					<span className="font-medium">
						To add the job to favorite, you need to be logged in
					</span>
				</div>
			));
			return;
		}

		try {
			const response = await fetch("/jobs/api/favorite-jobs", {
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
					<div className={styles["job-details-wrapper"]}>
						<Paper className='details-component-paper'>
							<section className={styles["job-details-page-info"]}>
								<div className={styles["job-general-details"]} style={{ marginTop: 0 }}>
									<div
										className={`flex flex-col w-full gap-3 pb-2 ${
											featured ? "rounded-lg border-2 border-[#a80202] bg-[#fff5f5] px-4 pt-3 pb-3" : ""
										}`}
									>
										<div className="flex flex-col mdl:flex-row mdl:justify-between gap-3 w-full">
											<div className="flex flex-wrap gap-x-3 gap-y-2 min-w-0 flex-1">
												{featured && (
													<span className="inline-flex items-center rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide bg-[#a80202] text-white shrink-0">
														Featured
													</span>
												)}
												<p className={styles["job-general-job-title"]}>{data?.jobTitle}</p>
											</div>
											<div className={`${styles["job-general-buttons"]} flex-col items-stretch mdl:items-end`}>
												<a href={data?.jobUrl} target='_blank' rel='noopener noreferrer' className="block w-full mdl:w-auto">
													<Button
														className={`btn-secondary-search`}
														hoverIcon='/jobs/images/icons/list-white.svg'
													>
														Apply Now
													</Button>
												</a>
											</div>
										</div>
										<div className={styles["job-secondary-actions"]}>
											{isSignedIn && (
												<button
													type="button"
													onClick={isFavorite ? handleDeleteClick : addJobToFavorite}
													className={styles["job-save-btn"]}
												>
													<Image
														src={saveIcon}
														alt=""
														width={18}
														height={18}
														style={{ filter: isFavorite ? "invert(41%) sepia(77%) saturate(355%) hue-rotate(70deg) brightness(95%) contrast(92%)" : "grayscale(100%) brightness(80%)" }}
													/>
													{isFavorite ? "Saved" : "Save"}
												</button>
											)}
											<ShareMenu url={shareUrl} title={data?.jobTitle ?? ""} />
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
						<div className={styles["job-details-sidebar"]}>
							{data?.companyDetails?.ceoCompany && (
								<Paper className='details-component-paper' style={{ marginBottom: "10px" }}>
									<section className={styles["job-company-card"]}>
										<img
											className={styles["job-company-card__logo"]}
											src={data?.imageUrl || defaultJobLogo.src}
											alt={data.companyDetails.ceoCompany}
										/>
										<p className={styles["job-company-card__name"]}>
											{data.companyDetails.ceoCompany}
										</p>
										{hasValue(data.companyDetails.companyDescription) && (
											<p className={styles["job-company-card__description"]}>
												{data.companyDetails.companyDescription}
											</p>
										)}
										{data.companyDetails.companyWebsite && (
											<a
												href={data.companyDetails.companyWebsite}
												target="_blank"
												rel="noopener noreferrer"
												className={styles["job-company-card__website"]}
											>
												<OpenInNewIcon fontSize="small" />
												Website
											</a>
										)}
									</section>
								</Paper>
							)}
							{data?.companyDetails?.ceoCompany ? (
								<RelatedJobs companyName={data?.companyDetails?.ceoCompany} currentJobId={data._id} />
							) : (
								<Paper className='details-component-paper'>
									<section className={styles["job-company-details"]}>
										<h2 className="text-md text-center font-semibold text-slate-800 mb-5 flex items-center gap-2">
											No Related Jobs Found
										</h2>
									</section>
								</Paper>
							)}
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