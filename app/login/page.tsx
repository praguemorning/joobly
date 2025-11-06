"use client";
import React, { useState } from "react";
import styles from "./login.module.scss";
import Button from "@/lib/components/button/button";
import Image from "next/image";
import google from "@/public/images/icons/googleIcon.svg";
import Input from "@/lib/components/input/input";
import { SubmitHandler, useForm } from "react-hook-form";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { Checkbox, Divider, FormControlLabel } from "@mui/material";
import { emailValidationRegexp } from "@/lib/constant/constants";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks";

import { signIn, useSession } from "next-auth/react";
import { redirect } from 'next/navigation'

import { FaLinkedin } from "react-icons/fa";

interface Inputs {
	email: string;
	password: string;
}

const Login = () => {
	const [errorMessage, setErrorMessage] = useState<string>();
	const session = useSession();
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<Inputs>();
	const { push } = useRouter();

	const dispatch: AppDispatch = useDispatch();
	const loading = useAppSelector((state) => state.user.loading);

	const onSubmit: SubmitHandler<Inputs> = async (values: Inputs) => {
		const login = await signIn('credentials', { redirect: false, email: values.email, password: values.password, callbackUrl: '/' });
		if (login) {
			push('/');
		} else {
			push('/error');
		}
	};


	if (session.status === "authenticated") {
		return redirect('/');
	}

	return (
		<section className={styles["login-page"]}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mx-auto"
			>
				<div className={styles["login-modal"]}>
					<div className={styles["login--modal-header"]}>
						<h1>Hi, Welcome to Joobly</h1>
						<p>Find your dream job in Joobly! We&apos;ll help you connect with top employers and take the first step toward a successful career.</p>
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
							<p className="mx-auto">or Sign in with Email</p>
						</Divider>
					</div>
					<div className={styles["login-modal-form"]}>
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
							placeholder='Enter email'
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
							placeholder='Enter password'
						/>
						<div className={styles["login-modal-form-remember-me"]}>
							<div className={styles["login-modal-form-remember-checkbox"]}>
								<FormControlLabel
									control={
										<Checkbox
											sx={{
												color: "#009C77",
												"&.Mui-checked": {
													color: "#009C77",
												},
											}}
											defaultChecked
										/>
									}
									label='Remember me'
								/>
							</div>
							<a href="/forgot-password" className={styles["login-modal-form-forgot-password"]}>
								Forgot your password?
							</a>
						</div>
						<Button style={{ width: "100%" }} className={"btn-primary"}>
							{errorMessage ? (
								<span className={styles["error-message"]}>{errorMessage}</span>
							) : loading ? (
								<CircularProgress />
							) : (
								"Login"
							)}
						</Button>
						<div className={styles["login-modal-form-create-account"]}>
							<p>
								Not registered yet?{" "}
								<a href='/register'>
									<span>Create an Account</span>
								</a>
							</p>
						</div>
					</div>
					<div className={styles["login-modal-footer"]}>
						<p>Joobly. All rights reserved.</p>
					</div>
				</div>
			</form>
		</section>
	);
};

export default Login;
