import { ImageResponse } from "next/og";
import { getItem } from "@/lib/jobs/jobsUtils";
import { extractId } from "@/lib/utils/extractId";
import { resolveLogo } from "@/lib/seo/ogLogo";
import { hasValue } from "@/lib/jobs/hasValue";
import type { JobLike } from "@/lib/seo/jobPosting";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "Job posting on Prague Morning Jobs";

const BRAND = "#a80202";
const INK = "#171821";

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

	const title = clamp(job?.jobTitle || "Job in Prague", 72);
	const company = job?.companyDetails?.ceoCompany?.trim() || "";

	const facts = [job?.location?.trim(), job?.workType?.trim(), job?.jobTime?.trim()]
		.filter((v): v is string => hasValue(v) && v !== "Any")
		.filter((v, i, all) => all.indexOf(v) === i)
		.slice(0, 3);

	const logo = await resolveLogo(job?.imageUrl);
	const PANEL_W = 900;
	const PANEL_H = 300;
	const LOGO_W = PANEL_W - 180;
	const LOGO_H = PANEL_H - 100;
	const fit = logo ? Math.min(LOGO_W / logo.width, LOGO_H / logo.height) : 0;

	const titleSize = title.length > 52 ? 44 : title.length > 34 ? 50 : 56;
	const fallbackSize = company.length > 26 ? 46 : 58;

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					backgroundColor: BRAND,
					backgroundImage:
						"radial-gradient(circle at 18% 12%, rgba(255,255,255,0.16), transparent 42%), radial-gradient(circle at 86% 92%, rgba(0,0,0,0.26), transparent 48%)",
					padding: "44px 60px 48px",
					fontFamily: "sans-serif",
				}}
			>
				<div
					style={{
						display: "flex",
						alignSelf: "flex-start",
						fontSize: 24,
						fontWeight: 700,
						letterSpacing: 3,
						textTransform: "uppercase",
						color: "rgba(255,255,255,0.82)",
					}}
				>
					Prague Morning Jobs
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: PANEL_W,
						height: PANEL_H,
						marginTop: 26,
						backgroundColor: "#ffffff",
						borderRadius: 16,
						padding: "50px 90px",
					}}
				>
					{logo ? (
						<img
							src={logo.src}
							width={Math.round(logo.width * fit)}
							height={Math.round(logo.height * fit)}
						/>
					) : (
						<div
							style={{
								display: "flex",
								fontSize: fallbackSize,
								fontWeight: 700,
								lineHeight: 1.2,
								color: INK,
								textAlign: "center",
							}}
						>
							{clamp(company || "Prague Morning Jobs", 44)}
						</div>
					)}
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						width: PANEL_W,
						marginTop: 30,
					}}
				>
					<div
						style={{
							display: "flex",
							fontSize: titleSize,
							fontWeight: 700,
							lineHeight: 1.18,
							color: "#ffffff",
							textAlign: "center",
						}}
					>
						{title}
					</div>

					{(company || facts.length > 0) && (
						<div
							style={{
								display: "flex",
								marginTop: 16,
								fontSize: 27,
								fontWeight: 500,
								color: "rgba(255,255,255,0.86)",
								textAlign: "center",
							}}
						>
							{[logo ? company : "", ...facts].filter(Boolean).join("  ·  ")}
						</div>
					)}
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
