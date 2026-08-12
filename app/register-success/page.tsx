"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
type Props = {};

const RegisterSuccess = (props: Props) => {
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			router.push("/login");
		}, 3500);
	}, [router]);


	return (
		<div className='flex flex-col items-center justify-center h-[85%] bg-[#cc0303]'>
			<h1 className='text-4xl font-bold text-white'>Register Success!</h1>
			<p className='text-lg text-white'>Now you can log in.</p>
		</div>
	);
};

export default RegisterSuccess;
