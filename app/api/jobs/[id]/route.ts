import { getSessionUser } from "@/lib/auth/session";
import { FEATURED_POINTS_COST } from "@/lib/constant/constants";
import { featuredUntilFromNow, isFeaturedActive } from "@/lib/jobs/featured";
import dbConnect from "@/database/dbConnect";
import { Job } from "@/models/Job";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await dbConnect();
  const singleJob = await Job.findById(id);
  return NextResponse.json(singleJob);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await dbConnect();

    const profileInfoDoc = await getSessionUser();
    if (!profileInfoDoc) {
      return NextResponse.json({ message: "you need to be logged in" }, { status: 401 });
    }

    const existing = await Job.findById(id);
    if (!existing) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const isOwner = String(existing.jobPostAuthorId) === String(profileInfoDoc._id);
    const isAdminUser = Boolean(profileInfoDoc.admin);
    if (!isOwner && !isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const data = await request.json();
    const {
      isFeatured: requestedFeatured,
      featuredUntil: _clientFeaturedUntil,
      jobPostAuthorId: _author,
      ...jobFields
    } = data;

    const updates: Record<string, unknown> = { ...jobFields };

    if (typeof requestedFeatured === "boolean") {
      const wasActive = isFeaturedActive(existing);

      if (requestedFeatured) {
        if (!wasActive && !isAdminUser) {
          const availablePoints = profileInfoDoc.jobPostPoints ?? 0;
          if (availablePoints < FEATURED_POINTS_COST) {
            return NextResponse.json(
              {
                message: `Featuring a job costs ${FEATURED_POINTS_COST} point. You have ${availablePoints}.`,
              },
              { status: 400 },
            );
          }
          profileInfoDoc.jobPostPoints = availablePoints - FEATURED_POINTS_COST;
          await profileInfoDoc.save();
        }
        updates.isFeatured = true;
        updates.featuredUntil = featuredUntilFromNow();
      } else {
        updates.isFeatured = false;
        updates.featuredUntil = null;
      }
    }

    const updatedJob = await Job.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json({ message: "Error updating job", error }, { status: 500 });
  }
}
