"use client";
import React, { useEffect, useState } from "react";
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
import { Divider } from "@mui/material";
import { emailValidationRegexp } from "@/lib/constant/constants";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useSignUp } from "@clerk/nextjs/legacy";
import toast, { Toaster } from "react-hot-toast";
import { FaLinkedin } from "react-icons/fa";

interface Inputs {
	name: string;
	email: string;
	password: string;
}

interface VerifyInputs {
	code: string;
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

function splitName(fullName: string): { firstName: string; lastName?: string } {
	const parts = fullName.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return { firstName: "User" };
	if (parts.length === 1) return { firstName: parts[0]! };
	return {
		firstName: parts[0]!,
		lastName: parts.slice(1).join(" "),
	};
}

const Register = () => {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<Inputs>();

	const {
		handleSubmit: handleVerifySubmit,
		control: verifyControl,
		formState: { errors: verifyErrors },
	} = useForm<VerifyInputs>();

	const [errorMessage, setErrorMessage] = useState<string>();
	const [submitting, setSubmitting] = useState(false);
	const [pendingVerification, setPendingVerification] = useState(false);
	const router = useRouter();
	const { status } = useSession();
	const { isLoaded: authLoaded, isSignedIn: clerkSignedIn } = useAuth();
	const { isLoaded: signUpLoaded, signUp, setActive } = useSignUp();
	const clerk = useClerk();

	const clerkReady = authLoaded && signUpLoaded;
	const isAuthenticated =
		clerkSignedIn === true || status === "authenticated";

	useEffect(() => {
		if (isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated, router]);

	/** Step 5 — Email/password sign-up via Clerk (legacy create + setActive). */
	const onSubmit: SubmitHandler<Inputs> = async (values) => {
		setErrorMessage(undefined);

		if (!signUp || !setActive) {
			toast.error("Clerk is still loading. Wait a second and try again.");
			return;
		}

		setSubmitting(true);
		try {
			const { firstName, lastName } = splitName(values.name);

			await signUp.create({
				emailAddress: values.email,
				password: values.password,
				firstName,
				...(lastName ? { lastName } : {}),
			});

			if (signUp.status === "complete") {
				await setActive({ session: signUp.createdSessionId });
				router.push("/register-success");
				return;
			}

			await signUp.prepareEmailAddressVerification({
				strategy: "email_code",
			});
			setPendingVerification(true);
			toast.success("Check your email for a verification code.");
		} catch (err: unknown) {
			const message = clerkErrorMessage(
				err,
				"Registration failed. The email may already be in use."
			);
			setErrorMessage(message);
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	const onVerify: SubmitHandler<VerifyInputs> = async (values) => {
		if (!signUp || !setActive) return;

		setSubmitting(true);
		try {
			const result = await signUp.attemptEmailAddressVerification({
				code: values.code,
			});

			if (result.status === "complete") {
				await setActive({ session: result.createdSessionId });
				router.push("/register-success");
				return;
			}

			toast.error(`Sign-up incomplete (${result.status}). Try again.`);
		} catch (err: unknown) {
			toast.error(clerkErrorMessage(err, "Invalid verification code."));
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

	if (!clerkReady) {
		return (
			<section className={styles["login-page"]}>
				<div className={styles["login-modal"]}>
					<p className="text-center py-8">Loading…</p>
				</div>
			</section>
		);
	}

	if (isAuthenticated) {
		return null;
	}

	if (pendingVerification) {
		return (
			<section className={styles["login-page"]}>
				<Toaster />
				<div className={styles["login-modal"]}>
					<div className={styles["login--modal-header"]}>
						<h1>Verify your email</h1>
						<p>
							Enter the code we sent to your email to finish creating your
							account.
						</p>
					</div>
					<form onSubmit={handleVerifySubmit(onVerify)}>
						<div className={styles["login-modal-form"]}>
							<Input
								control={verifyControl}
								startIcon={
									<MailOutlineIcon
										className={styles["login-modal-form-icon"]}
									/>
								}
								authInput
								errors={verifyErrors}
								name={"code"}
								label="Verification code"
								isRequired
								placeholder="123456"
							/>
							<div id="clerk-captcha" />
							<Button
								style={{ width: "100%" }}
								className={"btn-primary"}
								type="submit"
								disabled={submitting}
							>
								{submitting ? <CircularProgress size={24} /> : "Verify email"}
							</Button>
							<button
								type="button"
								className="text-sm underline mt-2"
								disabled={submitting}
								onClick={async () => {
									if (!signUp) return;
									try {
										await signUp.prepareEmailAddressVerification({
											strategy: "email_code",
										});
										toast.success("New code sent.");
									} catch (err: unknown) {
										toast.error(clerkErrorMessage(err, "Could not resend code."));
									}
								}}
							>
								Resend code
							</button>
						</div>
					</form>
				</div>
			</section>
		);
	}

	return (
		<section className={styles["login-page"]}>
			<Toaster />
			<div className={styles["login-modal"]}>
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
						<p>or Register in with Email</p>
					</Divider>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={styles["login-modal-form"]}>
						<Input
							control={control}
							startIcon={<Person className={styles["login-modal-form-icon"]} />}
							authInput
							errors={errors}
							name={"name"}
							label="Name"
							isRequired
							placeholder="John Doe"
						/>
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
							placeholder="johndoe@mail.com"
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
							placeholder="***********"
						/>
						{/* Clerk bot protection — must be in the DOM before signUp.create() */}
						<div id="clerk-captcha" />
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
								"Register"
							)}
						</Button>
						<div className={styles["login-modal-form-create-account"]}>
							<p>
								Already have an account?{" "}
								<a href="/login">
									<span>Log in</span>
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

export default Register;
