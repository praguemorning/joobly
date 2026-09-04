"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const RegisterSuccess = () => {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/");
		}, 2500);
		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="flex flex-col items-center justify-center h-[85%] bg-[#cc0303]">
			<h1 className="text-4xl font-bold text-white">Register Success!</h1>
			<p className="text-lg text-white">
				You&apos;re signed in — taking you to jobs…
			</p>
		</div>
	);
};

export default RegisterSuccess;
