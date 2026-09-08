"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
type Props = {};

const JobPostSuccess = (props: Props) => {
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			router.push("/dashboard");
		}, 3500);
	}, [router]);


	return (
		<div className='flex flex-col items-center justify-center h-[85%] bg-[#cc0303]'>
			<h1 className='text-4xl font-bold text-white'>Job Post Created!</h1>
			<p className='text-lg text-white'>
                Your vacancy is already being considered by potential employees.
            </p>
		</div>
	);
};

export default JobPostSuccess;
