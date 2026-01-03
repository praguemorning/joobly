"use client";

import { setSalaryLine } from "@/lib/constant/helpers";
import { StyledSwitch } from "@/lib/components/switch/switch";
import { SubmitHandler, useForm } from "react-hook-form";
import { useProfile } from "@/lib/hooks/useProfile";
import { useRouter } from "next/navigation";
import Button from "@/lib/components/button/button";
import dynamic from "next/dynamic";
import FormSelect from "@/lib/components/select/select";
import Input from "@/lib/components/input/input";
import React, { useState } from "react";
import styles from "./postJob.module.scss";
import toast from "react-hot-toast";
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
    SALARY_RANGES_DROPDOWN,
} from "@/lib/constant/constants";
import CustomDropdown from "../customDropdown/customDropdown";

interface PostJobProps {
    initialJob?: any;
    jobId?: string;
}

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
    imageUrl?: string;

}
const TextEditor = dynamic(() => import("@/lib/components/textEditor/TextEditor"), {
    ssr: false,
    loading: () => {
        return <div className='font-semibold text-primary'>Loading...</div>;
    },
});

const PostJob: React.FC<PostJobProps> = ({ initialJob, jobId }) => {
    const [showCompanyDetails, setShowCompanyDetails] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();
    const user = useProfile();
    const isEditMode = Boolean(jobId);
    const {
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: isEditMode ? {
            jobTitle: initialJob?.jobTitle || "",
            jobUrl: initialJob?.jobUrl || "",
            description: initialJob?.description || "",
            location: initialJob?.location || "",
            language: initialJob?.language || "",
            experienceLevel: initialJob?.experienceLevel || "",
            salary: initialJob?.salary || "",
            currency: initialJob?.currency || "",
            salaryDetail: initialJob?.salaryDetail || "",
            jobTime: initialJob?.jobTime || "",
            workType: initialJob?.workType || "",
            jobCategory: initialJob?.jobCategory || "",
            education: initialJob?.education || "",
            companySize: initialJob?.companyDetails?.companySize || "",
            founded: initialJob?.companyDetails?.founded || "",
            ceoCompany: initialJob?.companyDetails?.ceoCompany || "",
            companyWebsite: initialJob?.companyDetails?.companyWebsite || "",
            imageUrl: initialJob?.imageUrl || "",
        } : {
            jobTitle: "",
            jobUrl: "",
            description: "",
            location: "Prague",
            language: "English",
            experienceLevel: "Entry-level",
            salary: "",
            currency: "CZK",
            salaryDetail: "Month",
            jobTime: "Any",
            workType: "Any",
            jobCategory: "Other",
            education: "Any",
            companySize: "",
            founded: "",
            ceoCompany: "",
            companyWebsite: "",
            imageUrl: "",
        },
    });

    const title = watch("jobTitle");
    const jobUrl = watch("jobUrl");
    const location = watch("location");
    const description = watch("description");

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
            imageUrl: values.imageUrl,
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
        router.push("/post-job/preview");
    };

    const onSubmitFinal: SubmitHandler<Inputs> = async (values: Inputs) => {
        try {
            setIsSubmitting(true);
            const data = createDataForJob(values);

            if (user?.data?.jobPostPoints && user.data.jobPostPoints > 0) {
                const url = jobId ? `/api/jobs/${jobId}` : "/api/jobs";
                const method = jobId ? "PUT" : "POST";
                const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                const result = await response.json();

                if (response.ok) {
                    if (jobId) {
                        toast.success("Job updated successfully!");
                        setTimeout(() => {
                            router.refresh();
                        }, 1000);
                    } else {
                        router.push("/job-creation-success");
                    }
                } else {
                    console.error(result.error || "Error al guardar el trabajo");
                }
            } else {
                router.push("/packages");
            }
        } catch (error) {
            console.error("Error submitting job:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelClick = () => {
        router.push("/dashboard/admin");
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
                            defaultValue={initialJob?.jobCategory || "Other"}
                            options={JOB_CATEGORIES}
                        />
                    </div>
                    <div className={styles["post-job-page-input-wrapper"]}>
                        <FormSelect
                            control={control}
                            name={"location"}
                            label={"Job location"}
                            defaultValue={initialJob?.location || "Prague"}
                            options={CITIES}
                        />
                        <FormSelect
                            control={control}
                            name={"language"}
                            label={"Job language"}
                            defaultValue={initialJob?.language || "English"}
                            options={LANGUAGES}
                        />
                        {/* <FormSelect
                            control={control}
                            name={"experienceLevel"}
                            label={"Experience Level"}
                            defaultValue={initialJob?.experienceLevel || "Entry-level"}
                            options={EXPERIENCE_LEVEL}
                        /> */}
                    </div>
                    <div className={styles["post-job-page-input-wrapper"]}>
                        <FormSelect
                            control={control}
                            name={"workType"}
                            label={"Contract type"}
                            defaultValue={initialJob?.contractType || "Any"}
                            options={WORK_TYPES}
                        />
                        <FormSelect
                            control={control}
                            name={"jobTime"}
                            label={"Working hours"}
                            defaultValue={initialJob?.workingHours || "Any"}
                            options={WORK_TIMES}
                        />
                        <FormSelect
                            control={control}
                            name={"education"}
                            label={"Education"}
                            defaultValue={initialJob?.education || "Any"}
                            options={EDUCATION}
                        />
                    </div>
                    <div className={styles["post-job-page-input-wrapper"]}>
                        <CustomDropdown
                            control={control}
                            name={"salary"}
                            label={"Salary"}
                            options={SALARY_RANGES_DROPDOWN}
                            placeholder="Salary"
                            defaultValue={SALARY_RANGES_DROPDOWN[0].value || 0}
                        />
                        <FormSelect
                            control={control}
                            name={"currency"}
                            label={"Currency"}
                            defaultValue={initialJob?.currency || "CZK"}
                            options={CURRENCY}
                        />
                        <FormSelect
                            control={control}
                            name={"salaryDetail"}
                            label={"Choose time period"}
                            defaultValue={initialJob?.salaryDetail || "Month"}
                            options={SALARY_DETAILS}
                        />
                    </div>
                    <div className={styles["post-job-page-input-wrapper"]}>
                        <TextEditor control={control} label={"Job Description"} name='description' />
                    </div>
                    <div className={styles["post-job-page-input-wrapper"]}>
                        <Input
                            control={control}
                            errors={errors}
                            name={"imageUrl"}
                            label='Job Image URL (optional)'
                            placeholder='e.g. https://example.com/job-image.jpg'
                        />
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
                                {/* <div className={styles["post-job-page-input-wrapper"]}>
                                    <FormSelect
                                        control={control}
                                        defaultValue={initialJob?.companyDetails?.companySize || ""}
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
                                </div> */}
                            </>
                        )}
                    </section>
                    <div className={styles["post-job-page-buttons"]}>
                        <Button onClick={handleSubmit(onSubmitPreview)} type='submit' className={"btn-primary"}>
                            Preview
                        </Button>
                        <div className={styles["post-job-page-buttons-right-side"]}>
                            <Button
                                type="button"
                                onClick={cancelClick}
                                style={{ minWidth: "164px", height: "56px" }}
                                className={`btn-green-outlined`}
                            >
                                Cancel
                            </Button>
                            <Button
                                style={{ minWidth: "100px" }}
                                onClick={handleSubmit(onSubmitFinal)}
                                className={"btn-primary w-full"}
                                disabled={isSubmitting}
                            >
                                {isEditMode ? (isSubmitting ? "Updating..." : "Update Job") : (isSubmitting ? "Submitting..." : "Submit Job")}
                            </Button>
                        </div>
                    </div>
                </form>
            </section>
        </section>
    );
};

export default PostJob;
