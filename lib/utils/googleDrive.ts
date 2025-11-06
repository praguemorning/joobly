import { google } from 'googleapis';
import { Readable } from 'stream';
import mongoose from 'mongoose';
import { Resume } from '@/models/Resume';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

function readableStreamToNodeReadable(stream: ReadableStream<Uint8Array>): Readable {
  const reader = stream.getReader();

  return new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      } catch (error: any) {
        this.destroy(error);
      }
    },
  });
}

export const uploadToGoogleDriveAndSaveToDB = async (
  file: File,
  metadata: { email: string; jobTitle: string; location: string }
) => {
  try {

    await mongoose.connect(process.env.MONGODB_URI as string);

    const fileMetadata = {
      name: file.name,
      description: `Resume uploaded by ${metadata.email}`,
      properties: {
        email: metadata.email,
        jobTitle: metadata.jobTitle,
        location: metadata.location,
      },
    };

    const nodeReadableStream = readableStreamToNodeReadable(file.stream());

    const media = {
      mimeType: file.type,
      body: nodeReadableStream,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, name, webContentLink',
    });

    const fileId = response.data.id;

    if (!fileId) {
      throw new Error('Failed to upload file to Google Drive');
    }

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const fileDetails = await drive.files.get({
      fileId,
      fields: 'webContentLink',
    });

    const fileLink = fileDetails.data.webContentLink;

    if (!fileLink) {
      throw new Error('Failed to retrieve download link from Google Drive');
    }

    const resume = new Resume({
      fileName: file.name,
      fileLink,
      email: metadata.email,
      jobTitle: metadata.jobTitle,
      location: metadata.location,
    });

    await resume.save();

    return {
      message: 'File uploaded and saved to database successfully',
      resume,
      link: fileLink,
    };
  } catch (error: any) {
    console.error('Error uploading file or saving to database:', error.message);
    throw new Error(error.message);
  }
};