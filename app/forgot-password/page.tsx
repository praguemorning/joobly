"use client";

import React, { useEffect, useState } from "react";
import styles from "../login/login.module.scss";
import Button from "@/lib/components/button/button";
import Input from "@/lib/components/input/input";
import { SubmitHandler, useForm } from "react-hook-form";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { emailValidationRegexp } from "@/lib/constant/constants";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs/legacy";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

interface EmailInputs {
	email: string;
}

interface CodeInputs {
	code: string;
}

interface PasswordInputs {
	password: string;
	confirmPassword: string;
}

type Step = "email" | "code" | "password";

function clerkErrorMessage(err: unknown, fallback: string): string {
	const e = err as {
		errors?: { message?: string; longMessage?: string; code?: string }[];
		message?: string;
	};
	return (
		e?.errors?.[0]?.longMessage ||
		e?.errors?.[0]?.message ||
		e?.message ||
		fallback
	);
}

function isIdentifierNotFound(err: unknown): boolean {
	const e = err as { errors?: { code?: string }[] };
	return (
		e?.errors?.[0]?.code === "form_identifier_not_found" ||
		clerkErrorMessage(err, "").toLowerCase().includes("couldn't find") ||
		clerkErrorMessage(err, "").toLowerCase().includes("not found")
	);
}

const ForgotPassword = () => {
	const router = useRouter();
	const { isSignedIn, isLoaded: authLoaded } = useAuth();
	const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();

	const [step, setStep] = useState<Step>("email");
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>();

	const emailForm = useForm<EmailInputs>();
	const codeForm = useForm<CodeInputs>();
	const passwordForm = useForm<PasswordInputs>();

	const ready = authLoaded && signInLoaded;

	useEffect(() => {
		if (isSignedIn) {
			router.replace("/");
		}
	}, [isSignedIn, router]);

	/** Step 1 — create sign-in + send reset_password_email_code */
	const onSendCode: SubmitHandler<EmailInputs> = async ({ email }) => {
		if (!signIn) return;
		setErrorMessage(undefined);
		setSubmitting(true);

		try {
			await signIn.create({ identifier: email });

			const factor = signIn.supportedFirstFactors?.find(
				(f) => f.strategy === "reset_password_email_code"
			);

			if (!factor || factor.strategy !== "reset_password_email_code") {
				throw new Error(
					"Password reset is not available for this account. Try Google or LinkedIn, or contact support."
				);
			}

			await signIn.prepareFirstFactor({
				strategy: "reset_password_email_code",
				emailAddressId: factor.emailAddressId,
			});

			toast.success("Check your email for a reset code.");
			setStep("code");
		} catch (err: unknown) {
			if (isIdentifierNotFound(err)) {
				// Privacy: don't reveal whether the email is registered
				toast.success(
					"If an account exists for that email, a code is on its way."
				);
				return;
			}
			const message = clerkErrorMessage(
				err,
				"Could not send reset code. Check the email and try again."
			);
			setErrorMessage(message);
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	/** Step 2 — verify the email code */
	const onVerifyCode: SubmitHandler<CodeInputs> = async ({ code }) => {
		if (!signIn) return;
		setErrorMessage(undefined);
		setSubmitting(true);

		try {
			const result = await signIn.attemptFirstFactor({
				strategy: "reset_password_email_code",
				code,
			});

			if (result.status === "needs_new_password") {
				setStep("password");
				toast.success("Code verified. Choose a new password.");
				return;
			}

			throw new Error(`Unexpected status after code: ${result.status}`);
		} catch (err: unknown) {
			const message = clerkErrorMessage(err, "Invalid or expired code.");
			setErrorMessage(message);
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	/** Step 3 — set password and activate session */
	const onSubmitPassword: SubmitHandler<PasswordInputs> = async ({
		password,
		confirmPassword,
	}) => {
		if (!signIn || !setActive) return;
		setErrorMessage(undefined);

		if (password !== confirmPassword) {
			const message = "Passwords do not match.";
			setErrorMessage(message);
			toast.error(message);
			return;
		}

		setSubmitting(true);
		try {
			const result = await signIn.resetPassword({
				password,
				signOutOfOtherSessions: true,
			});

			if (result.status === "complete") {
				await setActive({ session: result.createdSessionId });
				toast.success("Password updated. You're signed in.");
				router.push("/");
				return;
			}

			toast.error(`Reset incomplete (${result.status}). Try signing in.`);
			router.push("/login");
		} catch (err: unknown) {
			const message = clerkErrorMessage(err, "Could not update password.");
			setErrorMessage(message);
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	if (!ready) {
		return (
			<section className={styles["login-page"]}>
				<div className={`${styles["login-modal"]} mx-auto`}>
					<p className="text-center py-8">Loading…</p>
				</div>
			</section>
		);
	}

	if (isSignedIn) {
		return null;
	}

	return (
		<section className={styles["login-page"]}>
			<Toaster />
			<div className={`${styles["login-modal"]} mx-auto`}>
				<div className={styles["login--modal-header"]}>
					<h1>
						{step === "email" && "Forgot your password?"}
						{step === "code" && "Enter reset code"}
						{step === "password" && "Choose a new password"}
					</h1>
					<p>
						{step === "email" &&
							"Enter the email for your account and we’ll send a reset code."}
						{step === "code" &&
							"Enter the code from your email to continue."}
						{step === "password" &&
							"Pick a new password (at least 8 characters). You’ll be signed in after."}
					</p>
				</div>

				{step === "email" && (
					<form onSubmit={emailForm.handleSubmit(onSendCode)}>
						<div className={styles["login-modal-form"]}>
							<Input
								control={emailForm.control}
								pattern={{
									value: emailValidationRegexp,
									message: "Invalid email address",
								}}
								startIcon={
									<MailOutlineIcon className={styles["login-modal-form-icon"]} />
								}
								authInput
								errors={emailForm.formState.errors}
								name="email"
								label="Email address"
								isRequired
								placeholder="Enter email"
							/>
							{errorMessage && (
								<span className={styles["error-message"]}>{errorMessage}</span>
							)}
							<Button
								style={{ width: "100%" }}
								className="btn-primary"
								type="submit"
								disabled={submitting}
							>
								{submitting ? <CircularProgress size={24} /> : "Send reset code"}
							</Button>
							<div className={styles["login-modal-form-create-account"]}>
								<p>
									Remembered it?{" "}
									<Link href="/login">
										<span>Back to login</span>
									</Link>
								</p>
							</div>
						</div>
					</form>
				)}

				{step === "code" && (
					<form onSubmit={codeForm.handleSubmit(onVerifyCode)}>
						<div className={styles["login-modal-form"]}>
							<Input
								control={codeForm.control}
								startIcon={
									<MailOutlineIcon className={styles["login-modal-form-icon"]} />
								}
								authInput
								errors={codeForm.formState.errors}
								name="code"
								label="Reset code"
								isRequired
								placeholder="123456"
							/>
							{errorMessage && (
								<span className={styles["error-message"]}>{errorMessage}</span>
							)}
							<Button
								style={{ width: "100%" }}
								className="btn-primary"
								type="submit"
								disabled={submitting}
							>
								{submitting ? <CircularProgress size={24} /> : "Verify code"}
							</Button>
							<button
								type="button"
								className="text-sm underline mt-2 text-left"
								disabled={submitting}
								onClick={() => {
									setStep("email");
									setErrorMessage(undefined);
									codeForm.reset();
								}}
							>
								Use a different email
							</button>
						</div>
					</form>
				)}

				{step === "password" && (
					<form onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
						<div className={styles["login-modal-form"]}>
							<Input
								control={passwordForm.control}
								minLength={{
									value: 8,
									message: "Password must have at least 8 characters",
								}}
								startIcon={
									<LockOutlinedIcon className={styles["login-modal-form-icon"]} />
								}
								type="password"
								authInput
								errors={passwordForm.formState.errors}
								name="password"
								label="New password"
								isRequired
								placeholder="********"
							/>
							<Input
								control={passwordForm.control}
								minLength={{
									value: 8,
									message: "Password must have at least 8 characters",
								}}
								startIcon={
									<LockOutlinedIcon className={styles["login-modal-form-icon"]} />
								}
								type="password"
								authInput
								errors={passwordForm.formState.errors}
								name="confirmPassword"
								label="Confirm password"
								isRequired
								placeholder="********"
							/>
							{errorMessage && (
								<span className={styles["error-message"]}>{errorMessage}</span>
							)}
							<Button
								style={{ width: "100%" }}
								className="btn-primary"
								type="submit"
								disabled={submitting}
							>
								{submitting ? (
									<CircularProgress size={24} />
								) : (
									"Update password"
								)}
							</Button>
						</div>
					</form>
				)}

				<div className={styles["login-modal-footer"]}>
					<p>Prague Morning. All rights reserved.</p>
				</div>
			</div>
		</section>
	);
};

export default ForgotPassword;
