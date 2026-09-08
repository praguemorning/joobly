import { NextResponse } from "next/server";
import { Job } from "@/models/Job";
import dbConnect from "@/database/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    const jobs = await Job.find({});
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching job options:", error);

    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}