import { categoryMatches } from "@/lib/constant/jobCategories";
import {
  JOB_TYPE_FIELDS,
  SALARY_RANGES as SALARY_BAND_RANGES,
  SALARY_NOT_SPECIFIED,
} from "@/lib/constant/filters";
import { parseSalary } from "@/lib/seo/jobPosting";
import { Job } from "@/models/Job";
import mongoose from "mongoose";
import xlsx from "xlsx";

import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { User } from "@/models/User";
import { SALARY_RANGES } from "@/lib/constant/constants";


export async function POST(req: Request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const session = await getServerSession(authOptions);
    if (!session) throw 'you need to be logged in';
    const email = session.user?.email;
    const profileInfoDoc = await User.findOne({ email });

    if (profileInfoDoc) {
      const data = await req.json();
      const job = await Job.create({
        ...data,
        advertisedDate: new Date().toISOString(),
        jobPostAuthorId: profileInfoDoc._id,
      });

      profileInfoDoc.jobPostPoints -= 1;
      await profileInfoDoc.save();

      return Response.json(job);
    } else {
      throw 'you need to be logged in';
    }
  } catch (error) {
    return Response.json({ error });
  }
}


/**
 * Salary is operator-entered free text, so bands cannot be expressed as a
 * database query — each posting is parsed and compared numerically instead. A
 * posting matches when its range overlaps the band at all.
 */
function matchesSalaryBand(raw: string | undefined, band: string): boolean {
  const parsed = parseSalary(raw);
  if (band === SALARY_NOT_SPECIFIED) return parsed === null;

  const range = SALARY_BAND_RANGES[band];
  if (!range || !parsed) return false;

  const upper = range.max ?? Number.POSITIVE_INFINITY;
  return parsed.min < upper && parsed.max >= range.min;
}

export async function GET(req: Request) {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    const job = await Job.findById(id);
    if (job) {
      return Response.json(job);
    } else {
      return Response.json({ message: "Job not found" }, { status: 404 });
    }
  }

  const query = Object.fromEntries(url.searchParams.entries());
  const filter: Record<string, any> = {};

  // Salary is applied after the query; see matchesSalaryBand.
  let salaryBand: string | null = null;

  for (const key in query) {
    const value = query[key];
    if (!value || value === "Any") continue;

    if (key === "jobCategory") {
      // Records still carry legacy names ("HR" for "HR & Recruitment"), and the
      // match below is exact, so expand to every value that means the same.
      const matches = categoryMatches(value);
      filter[key] = matches.length > 1 ? { $in: matches } : value;
    } else if (key === "jobType") {
      // The four Job Type options do not share a field: Full-time and Part-time
      // are on jobTime, Temporary and contract work on workType.
      const mapped = JOB_TYPE_FIELDS[value];
      if (mapped) {
        filter[mapped.field] =
          mapped.values.length > 1 ? { $in: mapped.values } : mapped.values[0];
      }
    } else if (key === "salary") {
      salaryBand = value;
    } else {
      filter[key] = value;
    }
  }

  // Aplica el filtro correctamente
  delete filter.includeExpired;

  let jobs = await Job.find(filter).sort({ createdAt: -1 });


  if (salaryBand) {
    jobs = jobs.filter((job: any) => matchesSalaryBand(job.salary, salaryBand as string));
  }

  return Response.json({ length: jobs.length, jobs });
}

