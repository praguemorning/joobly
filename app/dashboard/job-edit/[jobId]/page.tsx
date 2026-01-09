import PostJob from "@/lib/components/postJob";
import { getItem } from "@/lib/jobs/jobsUtils";
import { extractId } from "@/lib/utils/extractId";

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
    const id = extractId(jobId);
    const initialJob = jobId ? await getItem(id) : null; 

    return (
        <PostJob initialJob={initialJob} jobId={jobId} />
    );
}