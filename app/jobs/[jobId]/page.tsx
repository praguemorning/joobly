import DetailsContainer from "@/lib/components/detailsContainer/DetailsContainer";
import { getItem } from "@/lib/jobs/jobsUtils";
import { extractId } from "@/lib/utils/extractId";

interface JobDetailsPropsTypes {
  params: { jobId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}


const JobDetails = async ({ params }: JobDetailsPropsTypes) => {
  const id = extractId(params.jobId);
  const jobDetails = await getItem(id);

  return <DetailsContainer data={jobDetails} />;
};

export default JobDetails;
