import { Job } from "@/models/Job";
import mongoose from "mongoose";
import xlsx from "xlsx";

import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { User } from "@/models/User";
import { SALARY_RANGES } from "@/lib/constant/constants";


export async function POST(req: Request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const session = await getServerSession(authOptions);
    if (!session) throw 'you need to be logged in';
    const email = session.user?.email;
    const profileInfoDoc = await User.findOne({ email });

    if (profileInfoDoc) {
      const data = await req.json();
      const job = await Job.create({
        ...data,
        advertisedDate: new Date().toISOString(),
        jobPostAuthorId: profileInfoDoc._id,
      });

      profileInfoDoc.jobPostPoints -= 1;
      await profileInfoDoc.save();

      return Response.json(job);
    } else {
      throw 'you need to be logged in';
    }
  } catch (error) {
    return Response.json({ error });
  }
}


export async function GET(req: Request) {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    const job = await Job.findById(id);
    if (job) {
      return Response.json(job);
    } else {
      return Response.json({ message: "Job not found" }, { status: 404 });
    }
  }

  const query = Object.fromEntries(url.searchParams.entries());
  const filter: Record<string, any> = {};

  for (const key in query) {
    if (query[key]) {
      filter[key] = { $regex: new RegExp(`.*${query[key]}.*`, "i") };
    }
  }

  const jobs = await Job.find();

  // const jobs = await Job.find({ closeDate: { $gte: new Date() } });

  return Response.json({ length: jobs.length, jobs });
}


{/*

export async function DELETE(req) {
  await connectToDB();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ message: "ID is required" }, { status: 400 });
  }

  if (await isAdmin()) {
    const result = await Jobs.findByIdAndDelete(id);
    if (result) {
      return Response.json({ message: "Job is deleted" });
    } else {
      return Response.json({ message: "Job not found" }, { status: 404 });
    }
  } else {
    return Response.json({ message: "Unauthorized" }, { status: 403 });
  }
}
  
  */}

