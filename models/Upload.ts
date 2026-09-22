import { model, models, Schema } from "mongoose";

export type UploadTypes = {
	_id?: string;
	data: Buffer;
	contentType: string;
	byteSize: number;
	originalName?: string;
	uploadedBy?: string;
	createdAt?: Date;
};

export const UploadSchema = new Schema(
	{
		data: { type: Buffer, required: true },
		contentType: { type: String, required: true },
		byteSize: { type: Number, required: true },
		originalName: { type: String },
		uploadedBy: { type: String },
	},
	{ timestamps: true }
);

export const Upload = models.Upload || model("Upload", UploadSchema);
