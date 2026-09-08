import { categoryMatches } from "@/lib/constant/jobCategories";
import {
  JOB_TYPE_FIELDS,
  SALARY_RANGES as SALARY_BAND_RANGES,
  SALARY_NOT_SPECIFIED,
} from "@/lib/constant/filters";
import { parseSalary } from "@/lib/seo/jobPosting";
import { Job } from "@/models/Job";
import xlsx from "xlsx";

import { getSessionUser } from "@/lib/auth/session";
import { FEATURED_POINTS_COST } from "@/lib/constant/constants";
import { featuredUntilFromNow, sortJobsFeaturedFirst } from "@/lib/jobs/featured";
import dbConnect from "@/database/dbConnect";


export async function POST(req: Request) {
  try {
    await dbConnect();

    const profileInfoDoc = await getSessionUser();
    if (!profileInfoDoc) {
      return Response.json({ error: "you need to be logged in" }, { status: 401 });
    }

    const data = await req.json();
    const wantsFeatured = Boolean(data.isFeatured);
    const isAdminUser = Boolean(profileInfoDoc.admin);
    const pointsNeeded = wantsFeatured ? 1 + FEATURED_POINTS_COST : 1;
    const availablePoints = profileInfoDoc.jobPostPoints ?? 0;

    if (!isAdminUser && availablePoints < pointsNeeded) {
      return Response.json(
        {
          error: wantsFeatured
            ? `Featured jobs need ${pointsNeeded} points (1 for the post + ${FEATURED_POINTS_COST} for Featured). You have ${availablePoints}.`
            : "You need at least 1 job post point to publish.",
        },
        { status: 400 },
      );
    }

    const { isFeatured: _ignored, featuredUntil: _ignoredUntil, ...jobFields } = data;

    const job = await Job.create({
      ...jobFields,
      advertisedDate: new Date().toISOString(),
      jobPostAuthorId: profileInfoDoc._id,
      isFeatured: wantsFeatured,
      featuredUntil: wantsFeatured ? featuredUntilFromNow() : null,
    });

    if (!isAdminUser) {
      profileInfoDoc.jobPostPoints = availablePoints - pointsNeeded;
      await profileInfoDoc.save();
    }

    return Response.json(job);
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
  try {
    await dbConnect();
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

    jobs = sortJobsFeaturedFirst(jobs);

    return Response.json({ length: jobs.length, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch jobs";
    return Response.json({ error: message }, { status: 500 });
  }
}

