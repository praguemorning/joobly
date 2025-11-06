import { Job } from '@/models/Job';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const jobs = await Job.find({});
    return NextResponse.json({ jobs });
}

export async function DELETE(req: Request) {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const url = new URL(req.url);
    const id = url.searchParams.get('_id');
    if (!id) {
        return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }
    const result = await Job.findByIdAndDelete(id);
    return NextResponse.json({ success: !!result });
}
