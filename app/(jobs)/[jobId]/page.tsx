import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailsContainer from "@/lib/components/detailsContainer/DetailsContainer";
import { getItem } from "@/lib/jobs/jobsUtils";
import { extractId } from "@/lib/utils/extractId";
import {
  buildJobPostingSchema,
  isExpired,
  jobUrl,
  plainTextExcerpt,
  type JobLike,
} from "@/lib/seo/jobPosting";

interface JobDetailsPropsTypes {
  params: { jobId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// generateMetadata and the page body both need the job; cache() collapses that
// into a single upstream request per render.
const getJob = cache(
  async (jobId: string): Promise<JobLike | null> => getItem(extractId(jobId))
);

export async function generateMetadata({
  params,
}: JobDetailsPropsTypes): Promise<Metadata> {
  const job = await getJob(params.jobId);
  if (!job?.jobTitle) return { title: "Job not found", robots: { index: false, follow: false } };

  const company = job.companyDetails?.ceoCompany?.trim();
  const title = company ? `${job.jobTitle} at ${company}` : job.jobTitle;
  const description =
    plainTextExcerpt(job.description) ||
    `${job.jobTitle} in ${job.location?.trim() || "Prague"}.`;
  const canonical = jobUrl(job);

  return {
    title,
    description,
    alternates: { canonical },
    // Expired postings stay reachable but must not be indexed or carry markup.
    robots: isExpired(job)
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      ...(job.imageUrl ? { images: [{ url: job.imageUrl }] } : {}),
    },
  };
}

const JobDetails = async ({ params }: JobDetailsPropsTypes) => {
  const jobDetails = await getJob(params.jobId);
  if (!jobDetails?._id) notFound();

  const schema = buildJobPostingSchema(jobDetails);

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          // Descriptions are operator-supplied HTML, so "<" must be escaped to
          // prevent a </script> breakout.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <DetailsContainer data={jobDetails} />
    </>
  );
};

export default JobDetails;
