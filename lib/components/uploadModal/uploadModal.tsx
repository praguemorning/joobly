import Dropzone from "@/lib/components/dropzone/dropzone";
import Input from "@/lib/components/input/input";
import { emailValidationRegexp } from "@/lib/constant/constants";
import locationIcon from "@/public/images/icons/location-grey.svg";
import CloseIcon from "@mui/icons-material/Close";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Modal } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { useForm } from "react-hook-form";
import styles from "./uploadModal.module.scss";
import Button from "../button/button";

interface Inputs {
	email: string;
	title: string;
	location: string;
	file: File;
}
interface UploadModalPropsTypes {
	open: boolean;
	setOpen: (value: boolean) => void;
}
const UploadModal = ({ open, setOpen }: UploadModalPropsTypes) => {
	const handleClose = () => setOpen(false);
	const {
		handleSubmit,
		reset,
		control,
		setValue,
		formState: { errors },
	} = useForm<Inputs>();

	//files are correctly uploaded, backend url needs to be changed to prod url
	const onSubmit = async (values: Inputs) => {
		const formData = new FormData();
		formData.append("file", values.file);
		formData.append("email", values.email);
		formData.append("title", values.title);
		formData.append("location", values.location);

		try {
			const response = await fetch(`/api/resumes/upload`, {
				method: "POST",
				body: formData,
			  });
			  console.log(response);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const result = await response.json();

			console.log("Upload successful:", result);
			setOpen(false);
			reset();
			return result;
		} catch (error) {
			console.error("Error uploading resume:", error);
			throw error;
		}
		/* setOpen(false);
		reset(); */
	};

	const handleFileSelect = (file: File) => {
		setValue("file", file);
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<div className={styles["upload-modal"]}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<IconButton
						style={{ position: "absolute", top: "4px", right: "8px" }}
						onClick={() => setOpen(false)}
					>
						<CloseIcon />
					</IconButton>
					<h1 className={styles["upload-modal__title"]}>Upload your resume</h1>
					<p className={styles["upload-modal__subtitle"]}>
						Add your resume and get easier noticed by local recruiters!
					</p>
					<div className={styles["upload-modal__form"]}>
						<Dropzone onFileSelect={handleFileSelect} />
						<Input
							control={control}
							pattern={{
								value: emailValidationRegexp,
								message: "Invalid email address",
							}}
							startIcon={<MailOutlineIcon className={styles["login-modal-form-icon"]} />}
							authInput
							errors={errors}
							name={"email"}
							label='Email address'
							placeholder='Enter email...'
						/>
						<Input
							control={control}
							authInput
							isRequired
							errors={errors}
							name={"title"}
							label='Your job title or qualification'
							placeholder='Text...'
						/>
						<Input
							control={control}
							authInput
							isRequired
							errors={errors}
							name={"location"}
							label='Your location'
							placeholder='City...'
							endIcon={<Image src={locationIcon} alt='location' />}
						/>
						<div className={styles["upload-modal__form__buttons"]}>
							<Button
								onClick={() => setOpen(false)}
								style={{ maxWidth: "164px", height: "46px" }}
								className={`btn-green-outlined`}
							>
								Cancel
							</Button>
							<Button style={{ background: "#E6E6E6" }} type='submit' className='btn-main-grey'>
								Upload
							</Button>
						</div>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default UploadModal;
