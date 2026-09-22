import { ImageResponse } from "next/og";
import { getItem } from "@/lib/jobs/jobsUtils";
import { extractId } from "@/lib/utils/extractId";
import type { JobLike } from "@/lib/seo/jobPosting";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "Job posting on Prague Morning Jobs";

const BRAND = "#a80202";
const INK = "#171821";
const MUTED = "#5b6178";

function clamp(text: string, max: number): string {
	const clean = text.replace(/\s+/g, " ").trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max);
	const lastSpace = cut.lastIndexOf(" ");
	return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ jobId: string }> }
) {
	const { jobId } = await params;

	let job: JobLike | null = null;
	try {
		job = await getItem(extractId(jobId));
	} catch {
		job = null;
	}

	const title = clamp(job?.jobTitle || "Job in Prague", 90);
	const company = job?.companyDetails?.ceoCompany?.trim() || "";
	const location = job?.location?.trim() || "Prague";
	const salary = job?.salary?.trim()
		? `${job.salary.trim()} ${job.currency?.trim() || "CZK"}${
				job.salaryDetail?.trim() ? ` / ${job.salaryDetail.trim()}` : ""
			}`
		: "";

	const titleSize = title.length > 62 ? 58 : title.length > 40 ? 68 : 80;

	const facts = [location, job?.workType, job?.jobTime]
		.map((v) => v?.trim())
		.filter((v): v is string => Boolean(v) && v !== "Any")
		.filter((v, i, all) => all.indexOf(v) === i)
		.slice(0, 3);

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					backgroundColor: "#ffffff",
					padding: "64px 72px",
					fontFamily: "sans-serif",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: 16,
						backgroundColor: BRAND,
					}}
				/>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<div
						style={{
							display: "flex",
							fontSize: 28,
							fontWeight: 700,
							letterSpacing: 2,
							textTransform: "uppercase",
							color: BRAND,
						}}
					>
						Prague Morning Jobs
					</div>

					<div
						style={{
							display: "flex",
							marginTop: 28,
							fontSize: titleSize,
							fontWeight: 700,
							lineHeight: 1.12,
							color: INK,
						}}
					>
						{title}
					</div>

					{company && (
						<div
							style={{
								display: "flex",
								marginTop: 20,
								fontSize: 38,
								fontWeight: 600,
								color: MUTED,
							}}
						>
							{clamp(company, 48)}
						</div>
					)}
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					{salary && (
						<div
							style={{
								display: "flex",
								marginBottom: 20,
								fontSize: 34,
								fontWeight: 700,
								color: INK,
							}}
						>
							{clamp(salary, 40)}
						</div>
					)}

					<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
						{facts.map((fact) => (
							<div
								key={fact}
								style={{
									display: "flex",
									padding: "12px 24px",
									borderRadius: 999,
									backgroundColor: "#f3f4f8",
									fontSize: 28,
									fontWeight: 600,
									color: MUTED,
								}}
							>
								{fact}
							</div>
						))}
					</div>

					<div
						style={{
							display: "flex",
							marginTop: 32,
							fontSize: 26,
							color: MUTED,
						}}
					>
						praguemorning.cz/jobs
					</div>
				</div>
			</div>
		),
		{
			...OG_SIZE,
			headers: {
				"Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
			},
		}
	);
}
