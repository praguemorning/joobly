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
import { useSession } from "next-auth/react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs/legacy";
import toast, { Toaster } from "react-hot-toast";
import { FaLinkedin } from "react-icons/fa";

interface Inputs {
	email: string;
	password: string;
}

function clerkErrorMessage(err: unknown, fallback: string): string {
	const e = err as {
		errors?: { message?: string; longMessage?: string }[];
		message?: string;
	};
	return (
		e?.errors?.[0]?.longMessage ||
		e?.errors?.[0]?.message ||
		e?.message ||
		fallback
	);
}

const Login = () => {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<Inputs>();

	const [errorMessage, setErrorMessage] = useState<string>();
	const [submitting, setSubmitting] = useState(false);
	const { status } = useSession();
	const { isLoaded: authLoaded, isSignedIn: clerkSignedIn } = useAuth();
	const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();
	const clerk = useClerk();
	const router = useRouter();

	const clerkReady = authLoaded && signInLoaded;
	const isAuthenticated =
		clerkSignedIn === true || status === "authenticated";

	useEffect(() => {
		if (isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated, router]);

	/** Step 5 — Email/password via Clerk (legacy create + setActive). */
	const onSubmit: SubmitHandler<Inputs> = async (values) => {
		setErrorMessage(undefined);

		if (!signIn || !setActive) {
			toast.error("Clerk is still loading. Wait a second and try again.");
			return;
		}

		setSubmitting(true);
		try {
			const result = await signIn.create({
				identifier: values.email,
				password: values.password,
			});

			if (result.status === "complete") {
				await setActive({ session: result.createdSessionId });
				router.push("/");
				return;
			}

			toast.error(
				`Sign-in needs another step (${result.status}). Try Google/LinkedIn for now.`
			);
		} catch (err: unknown) {
			const message = clerkErrorMessage(err, "Invalid email or password");
			setErrorMessage(message);
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	/** Step 3–4 — Social via Clerk. Absolute URLs required with basePath /jobs. */
	const signInWithOAuth = async (
		strategy: "oauth_google" | "oauth_linkedin_oidc",
		e?: React.MouseEvent
	) => {
		e?.preventDefault();
		e?.stopPropagation();

		if (!authLoaded || !clerk.client) {
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
			toast.error(
				clerkErrorMessage(
					err,
					`${label} sign in failed. Is ${label} enabled in the Clerk Dashboard?`
				)
			);
		}
	};

	// Only wait on Clerk — do not block forever if NextAuth is slow/unavailable
	if (!clerkReady) {
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
					<p>
						Find your dream job with Prague Morning! We&apos;ll help you connect
						with top employers and take the first step toward a successful
						career.
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Button
						onClick={(e) => signInWithOAuth("oauth_google", e)}
						className={"btn-google-login-button"}
						type="button"
						disabled={!clerkReady}
					>
						<Image src={google} alt="" width={25} height={25} />
						Sign in with Google
					</Button>
					<Button
						onClick={(e) => signInWithOAuth("oauth_linkedin_oidc", e)}
						className={"btn-linkedin-login-button"}
						type="button"
						disabled={!clerkReady}
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
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={styles["login-modal-form"]}>
						<Input
							control={control}
							pattern={{
								value: emailValidationRegexp,
								message: "Invalid email address",
							}}
							startIcon={
								<MailOutlineIcon className={styles["login-modal-form-icon"]} />
							}
							authInput
							errors={errors}
							name={"email"}
							label="Email address"
							isRequired
							placeholder="Enter email"
						/>
						<Input
							control={control}
							minLength={{
								value: 8,
								message: "Password must have at least 8 characters",
							}}
							startIcon={
								<LockOutlinedIcon className={styles["login-modal-form-icon"]} />
							}
							type="password"
							authInput
							errors={errors}
							name={"password"}
							label="Password"
							isRequired
							placeholder="Enter password"
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
									label="Remember me"
								/>
							</div>
							<a
								href="/forgot-password"
								className={styles["login-modal-form-forgot-password"]}
							>
								Forgot your password?
							</a>
						</div>
						<Button
							style={{ width: "100%" }}
							className={"btn-primary"}
							type="submit"
							disabled={submitting}
						>
							{errorMessage ? (
								<span className={styles["error-message"]}>{errorMessage}</span>
							) : submitting ? (
								<CircularProgress size={24} />
							) : (
								"Login"
							)}
						</Button>
						<div className={styles["login-modal-form-create-account"]}>
							<p>
								Not registered yet?{" "}
								<a href="/register">
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
