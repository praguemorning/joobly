import { User } from '@/models/User';
import { Job } from '@/models/Job';
import { isIdentical } from '@/lib/constant/helpers';
import { getSessionUser } from "@/lib/auth/session";
import dbConnect from "@/database/dbConnect";

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    const user = await getSessionUser();
    if (!user) {
      return Response.json({ message: "you need to be logged in" }, { status: 401 });
    }
    const myJob = await Job.findById(_id);
    if (!myJob) {
      return Response.json({ message: "Job not found" }, { status: 404 });
    }

    const userHasProperty = isIdentical(user._id, myJob.jobPostAuthorId);

    if (userHasProperty) {
      await Job.deleteOne({ _id });
      return Response.json(true);
    }
    return Response.json({ message: "error, you don't have property", code: 501 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
