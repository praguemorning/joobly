import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Resume } from '@/models/Resume';
import { uploadToGoogleDriveAndSaveToDB } from '@/lib/utils/googleDrive';

export async function POST(req: NextRequest) {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI as string);

    // Insert data from wow, you don't believed, from formData
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const metadata = {
      email: formData.get('email') as string,
      jobTitle: formData.get('title') as string,
      location: formData.get('location') as string,
    };

    if (!metadata.email || !metadata.jobTitle || !metadata.location) {
      return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 });
    }

    // Upload file ot Google Drive ayl get link
    const driveResponse = await uploadToGoogleDriveAndSaveToDB(file, metadata);

    console.log('Drive response:', driveResponse); // Logging for debugging

    if (!driveResponse || !driveResponse.link) {
      throw new Error('Drive response does not contain a valid link');
    }
    // Creating a new data for DB
    const newResume = new Resume({
      fileName: driveResponse.link.split('/').pop() || 'Unnamed file', // File name
      fileLink: driveResponse.link, // Link to upload resume
      email: metadata.email,
      jobTitle: metadata.jobTitle,
      location: metadata.location,
      createdAt: new Date(),
    });

    const savedResume = await newResume.save();

    // Return a successful response
    return NextResponse.json({ success: true, resume: savedResume });
  } catch (error: any) {
    console.error('Error uploading resume:', error.message);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}