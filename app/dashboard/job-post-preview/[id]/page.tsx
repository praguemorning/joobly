import DetailsContainer from "@/lib/components/detailsContainer/DetailsContainer";
import { Job } from "@/models/Job";
import mongoose from "mongoose";


export default async function JobPostPreview({ params }: SearchParamProps) {
    const { id } = await params;
    await mongoose.connect(process.env.MONGODB_URI as string);
    const jobDetails = JSON.parse(JSON.stringify( await Job.findById(id)));
  return (
    <DetailsContainer data={jobDetails}/>
  );
};
