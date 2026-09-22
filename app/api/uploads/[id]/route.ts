import mongoose from "mongoose";
import { Upload } from "@/models/Upload";
import dbConnect from "@/database/dbConnect";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return new Response("Not found", { status: 404 });
		}

		await dbConnect();

		const upload = await Upload.findById(id).lean<{
			data?: Buffer | { buffer: Buffer };
			contentType?: string;
		}>();

		if (!upload?.data || !upload.contentType) {
			return new Response("Not found", { status: 404 });
		}

		const raw = upload.data as Buffer | { buffer: Buffer };
		const bytes = Buffer.isBuffer(raw) ? raw : Buffer.from(raw.buffer);

		return new Response(new Uint8Array(bytes), {
			headers: {
				"Content-Type": upload.contentType,
				"Content-Length": String(bytes.byteLength),
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("Error serving upload:", error);
		return new Response("Failed to load image", { status: 500 });
	}
}
