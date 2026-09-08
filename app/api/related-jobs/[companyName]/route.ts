import { Job } from '@/models/Job';
import { NextResponse } from 'next/server';
import mongoose from "mongoose";


export async function GET(request: Request, { params }: { params: Promise<{ companyName: string }>}) {
    const { companyName } = await params;
    await mongoose.connect(process.env.MONGODB_URI as string);
    const jobData = await Job.find({"companyDetails.ceoCompany": companyName});
    return NextResponse.json({jobs:jobData});
  }

