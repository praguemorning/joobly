import { Job } from '@/models/Job';
import { NextResponse } from 'next/server';
import mongoose from "mongoose";


export async function GET(request: Request, { params }: { params: { id: string }}) {
    const { id } = params;
    await mongoose.connect(process.env.MONGODB_URI as string);
    const singleJob = await Job.findById(id);
    return NextResponse.json(singleJob);
  }

export async function PUT (request: Request, { params }: { params: { id: string }}) {
    const { id } = params;
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        const data = await request.json();
        const updatedJob = await Job.findByIdAndUpdate(id, data, { new: true });

        if (updatedJob) {
            return NextResponse.json(updatedJob);
        } else {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ message: "Error updating job", error }, { status: 500 });
    }
}