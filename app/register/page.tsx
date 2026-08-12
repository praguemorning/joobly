"use client";
import React, { useState } from "react";
import styles from "./register.module.scss";
import Button from "@/lib/components/button/button";
import Image from "next/image";
import google from "@/public/images/icons/googleIcon.svg";
import Input from "@/lib/components/input/input";
import { SubmitHandler, useForm } from "react-hook-form";
import Person from "@mui/icons-material/Person";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { Checkbox, Divider, FormControlLabel } from "@mui/material";
import { emailValidationRegexp } from "@/lib/constant/constants";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks";
import { createUser } from "@/actions/user.actions";
import { signIn } from "next-auth/react";

import { FaLinkedin } from "react-icons/fa";


interface Inputs {
	name: string;
	email: string;
	password: string;
}

const Register = () => {
	const {
		handleSubmit,
		control,
		resetField,
		formState: { errors },
	} = useForm<Inputs>();

	const [errorMessage, setErrorMessage] = useState<string>();
	const router = useRouter();
	const dispatch: AppDispatch = useDispatch();
	const loading = useAppSelector((state) => state.user.loading);

	const onSubmit: SubmitHandler<Inputs> = async (values: Inputs) => {
		const userBody: Inputs = {
			name: values.name,
			email: values.email,
			password: values.password,
		};
		const newUser = await createUser(userBody);

		if (newUser) {
			router.push("/register-success");
		} else {
			router.push("/not-found")
		}

	};
	return (
		<section className={styles["login-page"]}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles["login-modal"]}>
					<div className={styles["login--modal-header"]}>
						<h1>Hi, Welcome to Prague Morning</h1>
						<p>Find your dream job with Prague Morning! We&apos;ll help you connect with top employers and take the first step toward a successful career.</p>
					</div>
					<div className="flex flex-col gap-2">
						<Button
							onClick={() => signIn('google', { callbackUrl: '/' })}
							className={"btn-google-login-button"}
							type="button"
						>
							<Image src={google} alt='' width={25} height={25} />
							Sign in with Google
						</Button>
						<Button
							onClick={() => signIn('linkedin', { callbackUrl: '/' })}
							className={"btn-linkedin-login-button"}
							type="button"
						>
							<FaLinkedin className="text-[#2873B3] w-7 h-7" />
							Sign in with LinkedIn
						</Button>
					</div>
					<div className={styles["login-modal-email-login"]}>
						<Divider>
							<p>or Register in with Email</p>
						</Divider>
					</div>
					<div className={styles["login-modal-form"]}>
						<Input
							control={control}
							startIcon={<Person className={styles["login-modal-form-icon"]} />}
							authInput
							errors={errors}
							name={"name"}
							label='Name'
							isRequired
							placeholder='John Doe'
						/>
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
							isRequired
							placeholder='johndoe@mail.com'
						/>
						<Input
							control={control}
							minLength={{
								value: 8,
								message: "Password must have at least 8 characters",
							}}
							startIcon={<LockOutlinedIcon className={styles["login-modal-form-icon"]} />}
							type='password'
							authInput
							errors={errors}
							name={"password"}
							label='Password'
							isRequired
							placeholder='***********'
						/>
						<Button style={{ width: "100%" }} className={"btn-primary"}>
							{errorMessage ? (
								<span className={styles["error-message"]}>{errorMessage}</span>
							) : loading ? (
								<CircularProgress />
							) : (
								"Register"
							)}
						</Button>
						<div className={styles["login-modal-form-create-account"]}>
							<p>
								Already have an account?{" "}
								<a href='/login'>
									<span>Log in</span>
								</a>
							</p>
						</div>
					</div>
					<div className={styles["login-modal-footer"]}>
						<p>Prague Morning. All rights reserved.</p>
					</div>
				</div>
			</form>
		</section>
	);
};

export default Register;
