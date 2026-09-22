import { Upload } from "@/models/Upload";
import { getSessionUser } from "@/lib/auth/session";
import dbConnect from "@/database/dbConnect";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/webp": "webp",
	"image/gif": "gif",
};

export async function POST(req: Request) {
	try {
		const user = await getSessionUser();
		if (!user) {
			return Response.json({ message: "you need to be logged in" }, { status: 401 });
		}

		const formData = await req.formData();
		const file = formData.get("file");

		if (!(file instanceof File) || file.size === 0) {
			return Response.json({ message: "No file uploaded" }, { status: 400 });
		}

		if (!ALLOWED_TYPES[file.type]) {
			return Response.json(
				{ message: "Unsupported format. Use PNG, JPG, WEBP or GIF." },
				{ status: 415 }
			);
		}

		if (file.size > MAX_UPLOAD_BYTES) {
			return Response.json(
				{ message: `File is too large. The limit is ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB.` },
				{ status: 413 }
			);
		}

		const bytes = Buffer.from(await file.arrayBuffer());

		if (!looksLikeImage(bytes, file.type)) {
			return Response.json(
				{ message: "That file does not look like a valid image." },
				{ status: 415 }
			);
		}

		await dbConnect();

		const saved = await Upload.create({
			data: bytes,
			contentType: file.type,
			byteSize: bytes.byteLength,
			originalName: file.name?.slice(0, 200),
			uploadedBy: String(user._id),
		});

		return Response.json({
			url: `/jobs/api/uploads/${saved._id}`,
			contentType: saved.contentType,
			byteSize: saved.byteSize,
		});
	} catch (error) {
		console.error("Error uploading image:", error);
		return Response.json({ message: "Failed to upload image" }, { status: 500 });
	}
}

function looksLikeImage(bytes: Buffer, contentType: string): boolean {
	if (bytes.byteLength < 12) return false;

	const png = bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
	const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
	const gif = bytes.subarray(0, 6).toString("ascii") === "GIF87a" || bytes.subarray(0, 6).toString("ascii") === "GIF89a";
	const webp =
		bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
		bytes.subarray(8, 12).toString("ascii") === "WEBP";

	switch (contentType) {
		case "image/png":
			return png;
		case "image/jpeg":
			return jpeg;
		case "image/gif":
			return gif;
		case "image/webp":
			return webp;
		default:
			return false;
	}
}
