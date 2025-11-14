"use client";
import React, { useState } from "react";
import styles from "./postJob.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "@/lib/components/input/input";
import FormSelect from "@/lib/components/select/select";
import {
	COMPANY_SIZE,
	//COUNTRIES,
	LANGUAGES,
	CITIES,
	CURRENCY,
	EDUCATION,
	SALARY_DETAILS,
	WORK_TIMES,
	WORK_TYPES,
	JOB_CATEGORIES,
	EXPERIENCE_LEVEL,
} from "@/lib/constant/constants";
import dynamic from "next/dynamic";
import { StyledSwitch } from "@/lib/components/switch/switch";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { addNewJob, setJobDetails } from "../../lib/features/jobSlice/jobSlice";
import { useRouter } from "next/navigation";
import { selectJobDetails } from "../../lib/selectors/selectors";
import { batch } from "react-redux";
import { useProfile } from "@/lib/hooks/useProfile";
import { setSalaryLine } from "@/lib/constant/helpers";
import Button from "@/lib/components/button/button";

interface Inputs {
	jobTitle: string;
	jobUrl: string;
	description: string;
	location: string;
	language: string;
	experienceLevel: string;
	salary: string;
	currency: string;
	salaryLabel?: string;
	salaryDetail: string;
	jobTime: string;
	workType: string;
	jobCategory: string;
	education: string;
	founded: string;
	ceoCompany: string;
	companySize: string;
	companyWebsite: string;

}
const TextEditor = dynamic(() => import("@/lib/components/textEditor/TextEditor"), {
	ssr: false,
	loading: () => {
		return <div className='font-semibold text-primary'>Loading...</div>;
	},
});
const PostJob = () => {
	const [showCompanyDetails, setShowCompanyDetails] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const { push } = useRouter();
	const jobDetails = useAppSelector(selectJobDetails);

	//profile for points check
	const user = useProfile();


	const {
		handleSubmit,
		control,
		watch,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			...jobDetails,
			...jobDetails?.companyDetails,
		},
	});


	const title = watch("jobTitle");
	const jobUrl = watch("jobUrl");
	const location = watch("location");
	const description = watch("description");

	//const country = watch("country");
	const createDataForJob = (values: Inputs) => {
		return {
			jobTitle: title,
			jobUrl: jobUrl,
			description: description,
			location: location,
			language: values.language,
			experienceLevel: values.experienceLevel,
			salary: values.salary,
			salaryLabel: setSalaryLine(values.salary),
			currency: values.currency,
			salaryDetail: values.salaryDetail,
			workType: values.workType,
			jobCategory: values.jobCategory,
			jobTime: values.jobTime,
			education: values?.education,
			companyDetails: {
				ceoCompany: values.ceoCompany,
				founded: values.founded,
				companySize: values.companySize,
				companyWebsite: values.companyWebsite,
			},
		};
	};
	const onSubmitPreview: SubmitHandler<Inputs> = (values: Inputs) => {
		const data = createDataForJob(values);
		dispatch(setJobDetails(data));
		push("/post-job/preview");
	};
	const onSubmitFinal: SubmitHandler<Inputs> = async (values: Inputs) => {
		try {
			setIsSubmitting(true);
			const data = createDataForJob(values);

			if (user?.data?.jobPostPoints && user.data.jobPostPoints > 0) {
				const response = await fetch("/api/jobs", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				const result = await response.json();

				if (response.ok) {
					batch(() => {
						dispatch(setJobDetails(null));
						dispatch(addNewJob(result));
						push("/job-creation-success");
					});
				} else {
					// Manejar error
					console.error(result.error || "Error al crear el trabajo");
				}
			} else {
				push("/packages");
			}
		} catch (error) {
			console.error("Error submitting job:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const cancelClick = () => {
		dispatch(setJobDetails(null));
		push("/");
	};


	return (
		<section className={styles["post-job-page"]}>
			<section className={styles["post-job-page-form"]}>
				<form>
					<Input
						control={control}
						errors={errors}
						name={"jobTitle"}
						label='Job title'
						isRequired
						placeholder='e.g. Web Developer'
					/>
					<div className={styles["post-job-page-input-wrapper"]}>
						<Input
							control={control}
							errors={errors}
							name={"jobUrl"}
							label='Job URL'
							isRequired
							placeholder='e.g. https://www.myjob.com'
						/>
					</div>
					<div className={styles["post-job-page-input-wrapper"]}>
						<FormSelect
							control={control}
							name={"jobCategory"}
							label={"Job category"}
							defaultValue={jobDetails?.jobCategory || "Other"}
							options={JOB_CATEGORIES}
						/>
					</div>
					<div className={styles["post-job-page-input-wrapper"]}>
						<FormSelect
							control={control}
							name={"location"}
							label={"Job location"}
							defaultValue={jobDetails?.location || "Prague"}
							options={CITIES}
						/>
						<FormSelect
							control={control}
							name={"language"}
							label={"Job language"}
							defaultValue={jobDetails?.language || "English"}
							options={LANGUAGES}
						/>
						<FormSelect
							control={control}
							name={"experienceLevel"}
							label={"Experience Level"}
							defaultValue={jobDetails?.experienceLevel || "Entry-level"}
							options={EXPERIENCE_LEVEL}
						/>


						{/*
						<FormSelect
							control={control}
							countrySelect
							name={"country"}
							label={"Country"}
							defaultValue={
								country || {
									code: "US",
									label: "United States",
									phone: "1",
									suggested: true,
								}
							}
							options={COUNTRIES}
						/>
						*/}

					</div>
					<div className={styles["post-job-page-input-wrapper"]}>
						<FormSelect
							control={control}
							name={"workType"}
							label={"Contract type"}
							defaultValue={jobDetails?.contractType || "Any"}
							options={WORK_TYPES}
						/>
						<FormSelect
							control={control}
							name={"jobTime"}
							label={"Working hours"}
							defaultValue={jobDetails?.workingHours || "Any"}
							options={WORK_TIMES}
						/>
						<FormSelect
							control={control}
							name={"education"}
							label={"Education"}
							defaultValue={jobDetails?.education || "Any"}
							options={EDUCATION}
						/>
					</div>
					<div className={styles["post-job-page-input-wrapper"]}>
						<Input
							control={control}

							errors={errors}
							name={"salary"}
							label='Salary'
							placeholder='Amount'
						/>
						<FormSelect
							control={control}
							name={"currency"}
							label={"Currency"}
							defaultValue={jobDetails?.currency || "CZK"}
							options={CURRENCY}
						/>
						<FormSelect
							control={control}
							name={"salaryDetail"}
							label={"Choose time period"}
							defaultValue={jobDetails?.salaryDetail || "Month"}
							options={SALARY_DETAILS}
						/>
					</div>
					<div className={styles["post-job-page-input-wrapper"]}>
						<TextEditor control={control} label={"Job Description"} name='description' />
					</div>
					<section className={styles["post-job-page-company-section"]}>
						<div className={styles["post-job-page-company-section-title"]}>
							<p>About the company</p>
							<div className={styles["post-job-page-company-section-switch"]}>
								<span>Hide this section</span>
								<StyledSwitch
									checked={showCompanyDetails}
									onChange={(e) => setShowCompanyDetails(e.target.checked)}
								/>
							</div>
						</div>
						{!showCompanyDetails && (
							<>
								<div className={styles["post-job-page-input-wrapper"]}>
									<Input
										control={control}
										errors={errors}
										name={"ceoCompany"}
										label='Company name'
										isRequired
										placeholder='Company name'
									/>
								</div>
								<div className={styles["post-job-page-input-wrapper"]}>
									<Input
										control={control}
										errors={errors}
										name={"companyWebsite"}
										label='Company website'
										isRequired
										placeholder='e.g. https://www.mycompany.com'
									/>
								</div>
								<div className={styles["post-job-page-input-wrapper"]}>
									<FormSelect
										control={control}
										defaultValue={jobDetails?.companyDetails?.companySize || ""}
										placeholder={"Number of employees"}
										name={"companySize"}
										label={"Number of employees"}
										options={COMPANY_SIZE}
									/>
									<Input
										control={control}
										errors={errors}
										name={"founded"}
										label='Founded'
										placeholder='e.g. 1990'
									/>
								</div>
							</>
						)}
					</section>
					<div className={styles["post-job-page-buttons"]}>
						<Button onClick={handleSubmit(onSubmitPreview)} type='submit' className={"btn-primary"}>
							Preview
						</Button>
						<div className={styles["post-job-page-buttons-right-side"]}>
							<Button
								onClick={cancelClick}
								style={{ minWidth: "164px", height: "56px" }}
								className={`btn-green-outlined`}
							>
								Cancel
							</Button>
							<Button
								style={{ minWidth: "100px" }}
								onClick={handleSubmit(onSubmitFinal)}
								className={"btn-primary"}
								disabled={isSubmitting}
							>
								Submit
							</Button>
						</div>
					</div>
				</form>
			</section>
		</section>
	);
};

export default PostJob;
