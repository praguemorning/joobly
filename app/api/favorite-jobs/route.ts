import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "You need to be logged in" }), { status: 401 });
    }

    const email = session.user?.email;
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const body = await req.json();
    const jobId = body.jobId;
    if (!jobId) {
      return new Response(JSON.stringify({ error: "No jobId provided" }), { status: 400 });
    }

    // Verificar si el job ya está en favoritos
    const jobExists = user.favoriteJobs.some((job: any) => job._id.toString() === jobId.toString());
    if (jobExists) {
      return new Response(JSON.stringify({ message: "Job already in favorites" }), { status: 400 });
    }

    // Buscar el job completo en la base de datos
    const { Job } = require("@/models/Job");
    const job = await Job.findById(jobId);
    if (!job) {
      return new Response(JSON.stringify({ error: "Job not found" }), { status: 404 });
    }

    // Añadir el job completo a favoritos
    user.favoriteJobs.push(job);
    await user.save();

    return new Response(JSON.stringify({ message: "Job added to favorites" }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    // MongoDB connection
    await mongoose.connect(process.env.MONGODB_URI as string);

    // Get request parameters
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');

    if (!_id) {
      return new Response(JSON.stringify({ error: "Job ID not provided" }), { status: 400 });
    }

    // session check
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "You need to be logged in" }), { status: 401 });
    }

    const email = session.user?.email;
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // deleting job from favoriteJobs
    const jobIndex = user.favoriteJobs.findIndex((job: any) => job._id.toString() === _id);

    if (jobIndex === -1) {
      return new Response(JSON.stringify({ error: "Job not found in favorites" }), { status: 404 });
    }

    user.favoriteJobs.splice(jobIndex, 1);
    await user.save();

    return new Response(JSON.stringify({ message: "Job removed from favorites" }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}