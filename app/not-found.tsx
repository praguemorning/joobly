import React from "react";
import Image from "next/image";
import Button from "@/lib/components/button/button";
import Link from "next/link";

type Props = {};

const NotFound = (props: Props) => {
	return (
		<div className='flex flex-col justify-between'>
			<div className='flex flex-col justify-center items-center p-12'>
				<Image priority src='/images/404banner.png' alt='404 Not Found' width={1200} height={500} />
				<h1 className=' text-xl font-bold text-center'>Page Not Found</h1>
				<p className='text-center text-sm font-light text-baseBlack50 mb-8'>
					It is a long established fact that a reader will be distracted by the readable content of
					a page when looking at its layout.
				</p>
				<Link href='/'>
					<Button style={{ width: "340px" }} className={"btn-primary"}>
						Go to Home
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
