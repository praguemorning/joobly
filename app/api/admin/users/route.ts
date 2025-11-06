import { User } from '@/models/User';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const users = await User.find({});
    return NextResponse.json({ users });
}

export async function DELETE(req: Request) {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const url = new URL(req.url);
    const id = url.searchParams.get('_id');
    if (!id) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    const result = await User.findByIdAndDelete(id);
    return NextResponse.json({ success: !!result });
}
