"use client";
import React, { useEffect, useState } from "react";
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
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

import { signIn, useSession } from "next-auth/react";
import { useAuth, useClerk } from "@clerk/nextjs";

import { FaLinkedin } from "react-icons/fa";

interface Inputs {
	email: string;
	password: string;
}

const Login = () => {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<Inputs>();

	const [errorMessage, setErrorMessage] = useState<string>();
	const { status } = useSession();
	const { isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useAuth();
	const clerk = useClerk();
	const { push, replace } = useRouter();
	const dispatch: AppDispatch = useDispatch();
	const loading = useAppSelector((state) => state.user.loading);

	const isAuthenticated =
		clerkSignedIn === true || status === "authenticated";

	useEffect(() => {
		if (isAuthenticated) {
			replace("/");
		}
	}, [isAuthenticated, replace]);

	const onSubmit: SubmitHandler<Inputs> = async (values: Inputs) => {
		const login = await signIn('credentials', { redirect: true, email: values.email, password: values.password, callbackUrl: '/' });
		if (login?.ok) {
			push('/');
		} else if (login?.error) {
			setErrorMessage("Invalid email or password");
			// Mostrar toast de error
			import('react-hot-toast').then(({ toast }) => {
				toast.error("Invalid email or password");
			});
		}
	};

	/** Step 3–4 — Social via Clerk. Absolute URLs required with basePath /jobs. */
	const signInWithOAuth = async (
		strategy: "oauth_google" | "oauth_linkedin_oidc",
		e?: React.MouseEvent
	) => {
		e?.preventDefault();
		e?.stopPropagation();

		if (!clerkLoaded || !clerk.client) {
			toast.error("Clerk is still loading. Wait a second and try again.");
			return;
		}

		const label = strategy === "oauth_google" ? "Google" : "LinkedIn";
		try {
			const origin = window.location.origin;
			await clerk.client.signIn.authenticateWithRedirect({
				strategy,
				redirectUrl: `${origin}/jobs/sso-callback`,
				redirectUrlComplete: `${origin}/jobs`,
			});
		} catch (err: unknown) {
			console.error(`${label} sign-in error:`, err);
			const clerkErr = err as { errors?: { message?: string; longMessage?: string }[]; message?: string };
			const message =
				clerkErr?.errors?.[0]?.longMessage ||
				clerkErr?.errors?.[0]?.message ||
				clerkErr?.message ||
				`${label} sign in failed. Is ${label} enabled in the Clerk Dashboard?`;
			toast.error(message);
		}
	};

	if (!clerkLoaded || status === "loading") {
		return (
			<section className={styles["login-page"]}>
				<div className={`${styles["login-modal"]} mx-auto`}>
					<p className="text-center py-8">Loading…</p>
				</div>
			</section>
		);
	}

	if (isAuthenticated) {
		return null;
	}

	return (
		<section className={styles["login-page"]}>
			<Toaster />
			<div className={`${styles["login-modal"]} mx-auto`}>
				<div className={styles["login--modal-header"]}>
					<h1>Hi, Welcome to Prague Morning</h1>
					<p>Find your dream job with Prague Morning! We&apos;ll help you connect with top employers and take the first step toward a successful career.</p>
				</div>
				<div className="flex flex-col gap-2">
					<Button
						onClick={(e) => signInWithOAuth("oauth_google", e)}
						className={"btn-google-login-button"}
						type="button"
						disabled={!clerkLoaded}
					>
						<Image src={google} alt='' width={25} height={25} />
						{clerkLoaded ? "Sign in with Google" : "Loading…"}
					</Button>
					<Button
						onClick={(e) => signInWithOAuth("oauth_linkedin_oidc", e)}
						className={"btn-linkedin-login-button"}
						type="button"
						disabled={!clerkLoaded}
					>
						<FaLinkedin className="text-[#2873B3] w-7 h-7" />
						{clerkLoaded ? "Sign in with LinkedIn" : "Loading…"}
					</Button>
				</div>
				<div className={styles["login-modal-email-login"]}>
					<Divider>
						<p className="mx-auto">or Sign in with Email</p>
					</Divider>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
				>
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
												color: "#cc0303",
												"&.Mui-checked": {
													color: "#cc0303",
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
				</form>
				<div className={styles["login-modal-footer"]}>
					<p>Prague Morning. All rights reserved.</p>
				</div>
			</div>
		</section>
	);
};

export default Login;
