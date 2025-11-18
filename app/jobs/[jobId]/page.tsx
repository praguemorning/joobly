import DetailsContainer from "@/lib/components/detailsContainer/DetailsContainer";
import { getItem } from "@/lib/jobs/jobsUtils";

interface JobDetailsPropsTypes {
  params: { jobId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}
const JobDetails = async ({ params }: JobDetailsPropsTypes) => {
  const jobDetails = await getItem(params.jobId)
  return (
    <DetailsContainer data={jobDetails} />
  );
};

export default JobDetails;