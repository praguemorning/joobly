import mongoose from "mongoose";
import { Upload } from "@/models/Upload";
import dbConnect from "@/database/dbConnect";

const TIMEOUT_MS = 6000;
const MAX_BYTES = 4 * 1024 * 1024;

const RASTER = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

const OWN_UPLOAD = /^\/jobs\/api\/uploads\/([0-9a-f]{24})$/;

export interface ResolvedLogo {
	src: string;
	width: number;
	height: number;
}

export async function resolveLogo(imageUrl?: string): Promise<ResolvedLogo | null> {
	const src = imageUrl?.trim();
	if (!src) return null;

	try {
		const own = src.match(OWN_UPLOAD);
		if (own) return await fromMongo(own[1]);
		if (/^https?:\/\//i.test(src)) return await fromRemote(src);
	} catch {
		return null;
	}
	return null;
}

async function fromMongo(id: string): Promise<ResolvedLogo | null> {
	if (!mongoose.Types.ObjectId.isValid(id)) return null;
	await dbConnect();

	const upload = await Upload.findById(id).lean<{
		data?: Buffer | { buffer: Buffer };
		contentType?: string;
	}>();

	if (!upload?.data || !RASTER.has(upload.contentType ?? "")) return null;

	const raw = upload.data as Buffer | { buffer: Buffer };
	const bytes = Buffer.isBuffer(raw) ? raw : Buffer.from(raw.buffer);
	if (bytes.byteLength > MAX_BYTES) return null;

	return pack(bytes, upload.contentType!);
}

async function fromRemote(url: string): Promise<ResolvedLogo | null> {
	const abort = new AbortController();
	const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);

	try {
		const res = await fetch(url, { signal: abort.signal, redirect: "follow" });
		if (!res.ok) return null;

		const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
		if (!RASTER.has(type)) return null;

		const bytes = Buffer.from(await res.arrayBuffer());
		if (!bytes.byteLength || bytes.byteLength > MAX_BYTES) return null;

		return pack(bytes, type);
	} finally {
		clearTimeout(timer);
	}
}

function pack(bytes: Buffer, contentType: string): ResolvedLogo | null {
	const size = intrinsicSize(bytes, contentType);
	if (!size) return null;
	return {
		src: `data:${contentType};base64,${bytes.toString("base64")}`,
		...size,
	};
}

function intrinsicSize(b: Buffer, type: string): { width: number; height: number } | null {
	try {
		if (type === "image/png" && b.length > 24) {
			return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
		}
		if (type === "image/gif" && b.length > 10) {
			return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
		}
		if (type === "image/webp" && b.length > 30) {
			const fourcc = b.subarray(12, 16).toString("ascii");
			if (fourcc === "VP8X") return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
			if (fourcc === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
			if (fourcc === "VP8L") {
				const n = b.readUInt32LE(21);
				return { width: (n & 0x3fff) + 1, height: ((n >> 14) & 0x3fff) + 1 };
			}
			return null;
		}
		if (type === "image/jpeg") {
			let i = 2;
			while (i + 9 < b.length) {
				if (b[i] !== 0xff) {
					i++;
					continue;
				}
				const marker = b[i + 1];
				if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
					return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
				}
				i += 2 + b.readUInt16BE(i + 2);
			}
		}
	} catch {
		return null;
	}
	return null;
}
