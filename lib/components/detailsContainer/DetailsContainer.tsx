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
import { isFeaturedActive } from "@/lib/jobs/featured";

const DetailsContainer = ({ data }: any) => {
	const { isSignedIn } = useAuth();
	const profile = useProfile();
	const currentUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
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

	const socialPlatforms = [
		{
			name: 'Share on Facebook',
			url: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
			color: '#1877F2',
			icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
		},
		{
			name: 'Share on X',
			url: `https://twitter.com/intent/tweet?url=${currentUrl}`,
			color: '#000000',
			icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z',
		},
		{
			name: 'Share on LinkedIn',
			url: `https://www.linkedin.com/shareArticle?url=${currentUrl}`,
			color: '#0A66C2',
			icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
		},
		{
			name: 'Share on WhatsApp',
			url: `https://api.whatsapp.com/send?text=${currentUrl}`,
			color: '#25D366',
			icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z',
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
												<div className="flex items-center justify-start mdl:justify-end gap-1 mt-2">
													{isSignedIn && (
														<span
															onClick={isFavorite ? handleDeleteClick : addJobToFavorite}
															className="flex-shrink-0 cursor-pointer flex items-center justify-center w-9 h-9"
														>
															<Image
																src={saveIcon}
																alt="save"
																style={{ filter: isFavorite ? "invert(41%) sepia(77%) saturate(355%) hue-rotate(70deg) brightness(95%) contrast(92%)" : "grayscale(100%) brightness(80%)" }}
															/>
														</span>
													)}
													{socialPlatforms.map((platform) => (
														<a
															key={platform.name}
															href={platform.url}
															target="_blank"
															rel="noopener noreferrer"
															aria-label={platform.name}
															className="social-button flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-white transition-all duration-150"
															style={{ backgroundColor: "transparent" }}
															onMouseEnter={e => (e.currentTarget.style.backgroundColor = platform.color)}
															onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
														>
															<svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
																<path d={platform.icon} />
															</svg>
														</a>
													))}
												</div>
											</div>
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
								<Paper className='details-component-paper' style={{ marginBottom: "10px" }}>
									<section className={styles["job-company-details"]} style={{ marginTop: 0, marginBottom: 0 }}>
										<div className={styles["key-value-wrapper"]}>
											<p className={styles["key"]} style={{ fontWeight: "600" }}>
												Company :
											</p>
											<p className={styles["value"]}>
												{data?.companyDetails?.ceoCompany || "N/A"}
											</p>
										</div>
										{data.companyDetails.companyWebsite &&
											<div className={styles["key-value-wrapper"]} style={{ marginTop: "20px" }}>
												<a
													href={data.companyDetails.companyWebsite}
													target="_blank"
													className={styles["key"]}
													style={{ display: "flex", alignItems: "center", gap: "5px" }}
												>
													<OpenInNewIcon />
													Website
												</a>
											</div>
										}
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