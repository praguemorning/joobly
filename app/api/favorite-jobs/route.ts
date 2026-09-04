import { getSessionUser } from "@/lib/auth/session";
import dbConnect from "@/database/dbConnect";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const user = await getSessionUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "You need to be logged in" }), { status: 401 });
    }

    const body = await req.json();
    const jobId = body.jobId;
    if (!jobId) {
      return new Response(JSON.stringify({ error: "No jobId provided" }), { status: 400 });
    }

    const jobExists = user.favoriteJobs?.some((job: { _id: { toString: () => string } }) => job._id.toString() === jobId.toString());
    if (jobExists) {
      return new Response(JSON.stringify({ message: "Job already in favorites" }), { status: 400 });
    }

    const { Job } = require("@/models/Job");
    const job = await Job.findById(jobId);
    if (!job) {
      return new Response(JSON.stringify({ error: "Job not found" }), { status: 404 });
    }

    user.favoriteJobs = user.favoriteJobs || [];
    user.favoriteJobs.push(job);
    await user.save();

    return new Response(JSON.stringify({ message: "Job added to favorites" }), { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');

    if (!_id) {
      return new Response(JSON.stringify({ error: "Job ID not provided" }), { status: 400 });
    }

    const user = await getSessionUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "You need to be logged in" }), { status: 401 });
    }

    const jobIndex = user.favoriteJobs?.findIndex((job: { _id: { toString: () => string } }) => job._id.toString() === _id) ?? -1;

    if (jobIndex === -1) {
      return new Response(JSON.stringify({ error: "Job not found in favorites" }), { status: 404 });
    }

    user.favoriteJobs?.splice(jobIndex, 1);
    await user.save();

    return new Response(JSON.stringify({ message: "Job removed from favorites" }), { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
