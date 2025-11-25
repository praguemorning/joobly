import PostJob from "@/lib/components/postJob";
import { getItem } from "@/lib/jobs/jobsUtils";

interface EditJobPageProps {
    params: {
        jobId: string;
    };
}

export const metadata = {
    title: "Edit Job - Joobly",
};

export default async function EditJobPage({ params }: EditJobPageProps) {
    const jobId = params.jobId;
    const initialJob = jobId ? await getItem(jobId) : null; 

    return (
        <PostJob initialJob={initialJob} jobId={jobId} />
    );
}