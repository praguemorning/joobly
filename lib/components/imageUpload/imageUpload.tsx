"use client";

import React, { useCallback, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./imageUpload.module.scss";

const MAX_BYTES = 4 * 1024 * 1024;

const ACCEPT = {
	"image/png": [".png"],
	"image/jpeg": [".jpg", ".jpeg"],
	"image/webp": [".webp"],
	"image/gif": [".gif"],
};

interface ImageUploadProps {
	control: any;
	name: string;
	label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	control,
	name,
	label = "Company logo",
}) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { value, onChange } }) => (
				<ImageUploadField label={label} value={value || ""} onChange={onChange} />
			)}
		/>
	);
};

function ImageUploadField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (next: string) => void;
}) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showUrlField, setShowUrlField] = useState(false);
	const [localPreview, setLocalPreview] = useState<string | null>(null);
	const objectUrl = useRef<string | null>(null);

	const releasePreview = useCallback(() => {
		if (objectUrl.current) {
			URL.revokeObjectURL(objectUrl.current);
			objectUrl.current = null;
		}
		setLocalPreview(null);
	}, []);

	const upload = useCallback(
		async (file: File) => {
			setError(null);

			if (file.size > MAX_BYTES) {
				setError(`That file is ${(file.size / (1024 * 1024)).toFixed(1)}MB. The limit is 4MB.`);
				return;
			}

			releasePreview();
			objectUrl.current = URL.createObjectURL(file);
			setLocalPreview(objectUrl.current);
			setUploading(true);

			try {
				const body = new FormData();
				body.append("file", file);

				const res = await fetch("/jobs/api/uploads", { method: "POST", body });
				const result = await res.json().catch(() => ({}));

				if (!res.ok) {
					throw new Error(result?.message || "Upload failed. Please try again.");
				}

				onChange(result.url);
			} catch (err: any) {
				setError(err?.message || "Upload failed. Please try again.");
				releasePreview();
			} finally {
				setUploading(false);
			}
		},
		[onChange, releasePreview]
	);

	const onDrop = useCallback(
		(accepted: File[]) => {
			if (accepted.length > 0) void upload(accepted[0]);
		},
		[upload]
	);

	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		onDrop,
		accept: ACCEPT,
		maxFiles: 1,
		multiple: false,
		noClick: true,
		noKeyboard: true,
	});

	const preview = localPreview || value;

	const clear = () => {
		releasePreview();
		setError(null);
		onChange("");
	};

	return (
		<section className={styles["image-upload"]}>
			<p className={styles["image-upload__label"]}>
				{label} <span className={styles["image-upload__optional"]}>(optional)</span>
			</p>

			{preview ? (
				<div className={styles["image-upload__preview"]}>
					<img src={preview} alt="Company logo preview" />
					<div className={styles["image-upload__preview-meta"]}>
						<p className={styles["image-upload__preview-state"]}>
							{uploading ? "Uploading…" : "Logo added"}
						</p>
						<button
							type="button"
							className={styles["image-upload__link-btn"]}
							onClick={open}
							disabled={uploading}
						>
							Replace
						</button>
					</div>
					<button
						type="button"
						aria-label="Remove logo"
						className={styles["image-upload__remove"]}
						onClick={clear}
						disabled={uploading}
					>
						<CloseIcon fontSize="small" />
					</button>
					<input {...getInputProps()} />
				</div>
			) : (
				<div
					{...getRootProps({
						className: `${styles["image-upload__dropzone"]} ${
							isDragActive ? styles["image-upload__dropzone--active"] : ""
						}`,
					})}
				>
					<input {...getInputProps()} />
					<h4>{uploading ? "Uploading…" : "Drag a logo here"}</h4>
					<button
						type="button"
						className={styles["image-upload__choose"]}
						onClick={open}
						disabled={uploading}
					>
						Choose a file
					</button>
					<p>PNG, JPG, WEBP or GIF · up to 4MB</p>
				</div>
			)}

			{error && <p className={styles["image-upload__error"]}>{error}</p>}

			{showUrlField ? (
				<div className={styles["image-upload__url-row"]}>
					<input
						type="url"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder="https://example.com/logo.png"
						className={styles["image-upload__url-input"]}
					/>
					<button
						type="button"
						className={styles["image-upload__link-btn"]}
						onClick={() => setShowUrlField(false)}
					>
						Hide
					</button>
				</div>
			) : (
				<button
					type="button"
					className={styles["image-upload__link-btn"]}
					onClick={() => setShowUrlField(true)}
				>
					Or paste an image URL
				</button>
			)}
		</section>
	);
}

export default ImageUpload;
