"use client"
import { useEffect, useState } from "react";
import "./header.scss";
import Button from "../button/button";
import Link from "next/link";
import Image from "next/image";
import LoginBtn from "../loginBtn/loginBtn";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";


import { signOut, useSession } from 'next-auth/react';

import { FaUser } from "react-icons/fa";
import { RiDoorOpenFill } from "react-icons/ri";
import { useProfile } from "@/lib/hooks/useProfile";
import { UserProfileTypes } from "@/models/User";





const TopHeader = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const session = useSession();
	const status = session.status;

	const pathname = usePathname();

	const profile = useProfile();
	const profileEmail = (profile.data as UserProfileTypes)?.email;

	const userData = session.data?.user as UserTypes;
	const gmailCredentials = userData?.email.indexOf("gmail");


	useEffect(() => {
		if (gmailCredentials) {
			if (!profileEmail) {
				fetch('/api/profile', {
					method: 'POST',
					headers: { 'Content-type': 'application/json' },
					body: JSON.stringify({
						email: userData.email,
						name: userData.name,
						image: userData.image,
					}),
				});
			}
		}
	}, [gmailCredentials]);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const menuVariants = {
		open: { opacity: 1, x: 0 },
		closed: { opacity: 0, x: "-100%" },
	};

	const lineVariants = {
		open: {
			top: 8,
			rotate: 45,
			backgroundColor: "#006c53",
		},
		middleHidden: { opacity: 0 },
		closeTop: {
			top: 0,
			rotate: 0,
			backgroundColor: "#006c53",
		},
		closeBottom: {
			top: 16,
			rotate: 0,
			backgroundColor: "#006c53",
		}
	};

	return (
		<div className='header'>
			<div className='header-top'>
				<div className='search-post-group flex gap-2 -ml-3 xl:gap-12 items-center'>
					<div className='search-group'>
						<Link href={"/"}>
							<Image
								src={"/images/logos/logo-joobly.svg"}
								alt='search'
								className='header-logo'
								width={200}
								height={200}
							/>
						</Link>
						{/*<input type="text" className='header-search' placeholder='Company, Job Title...' />*/}
					</div>
					{/*hеader nav links*/}
					<div className="text-sm xl:text-base hidden md:flex gap-6 lg:gap-2 xl:gap-12 text-baseBlack50">
						<Link href='/' className={`flex items-center gap-1 ${pathname === '/' && 'text-black'}`}>
							<Image
								className='w-5 h-5 package-image'
								src={"/images/icons/home.svg"}
								width={26}
								height={26}
								alt='packages'
							/>
							<span className="text-nowrap">Home</span>
						</Link>
						<Link href='/jobs' className={`flex items-center gap-1 ${pathname === '/jobs' && 'text-black'}`}>
							<Image
								className='w-5 h-5 package-image'
								src={"images/icons/findJob.svg"}
								width={26}
								height={26}
								alt='packages'
							/>
							<span className="text-nowrap">Find a job</span>
						</Link>
						<Link href='/post-job-info' className={`flex items-center gap-1 ${pathname === '/post-job-info' && 'text-black'}`}>
							<Image
								className='w-5 h-5 package-image'
								src={"/images/icons/listing.svg"}
								width={26}
								height={26}
								alt='packages'
							/>
							<span className="text-nowrap">Post a job</span>
						</Link>
						<Link href='/packages' className={`flex items-center gap-1 ${pathname === '/packages' && 'text-black'}`}>
							<Image
								className='w-5 h-5 package-image'
								src={"/images/icons/package-icon.svg"}
								width={26}
								height={26}
								alt='packages'
							/>
							<span className="text-nowrap">Packages</span>
						</Link>
					</div>
				</div>
				<div className='post-btn-group'>
					<Link href={"/contact"}>
						<Button
							icon={"images/icons/contact.svg"}
							style={{ maxWidth: "227px", height: "62px", borderRadius: "18px", gap: "10px" }}
							className={`btn-green-outlined`}
						>
							Contact us
						</Button>
					</Link>

					<Link href={"/post-resume"}>
						<Button
							icon={"images/icons/add.svg"}
							style={{ maxWidth: "185px", gap: "10px" }}
							className='btn header-post-resume'
						>
							Post your resume
						</Button>
					</Link>
					<div className="hidden lgl:flex">
						{status === 'authenticated' ? (
							<div className="flex gap-4 items-center">
								<Link
									href={'/dashboard'}
									className="border-2 border-[#006c53] py-[15px] 
								px-6 rounded-2xl hover:border-[#83cfbe] duration-300">
									<FaUser className="text-black w-7 h-7 cursor-pointer" />
								</Link>
								<div
									onClick={() => signOut()}
									className="border-2 border-[#006c53] py-2 px-4 rounded-2xl hover:border-[#83cfbe] duration-300">
									<RiDoorOpenFill className="text-black w-10 h-10 cursor-pointer" />
								</div>
							</div>
						) : (
							<LoginBtn />
						)}
					</div>
				</div>
				{/*menu button animated*/}
				<div className="menu-button" onClick={toggleMenu}>
					<motion.span
						animate={isMenuOpen ? lineVariants.open : lineVariants.closeTop}
						className="menu-line rounded-xl"
					/>
					<motion.span
						animate={isMenuOpen ? lineVariants.middleHidden : {}}
						className="menu-line rounded-xl"
					/>
					<motion.span
						animate={isMenuOpen ? { ...lineVariants.open, rotate: -45 } : lineVariants.closeBottom}
						className="menu-line rounded-xl"
					/>
				</div>
			</div>
			{/* Mobile Menu */}
			<motion.div
				onClick={toggleMenu}
				className="z-50 mobile-menu fixed top-20 left-0 bg-white w-full h-full p-6"
				initial="closed"
				animate={isMenuOpen ? "open" : "closed"}
				variants={menuVariants}
				transition={{ duration: 0.3 }}
			>
				<nav className='mobile-nav-links flex flex-col space-y-6 mx-auto text-lg'>
					<Link
						href='/'
						onClick={toggleMenu}
						className={`flex items-center gap-1 md:hidden ${pathname === '/' && 'text-[#006c53]'}`}
					>
						<Image
							className='w-5 h-5 package-image'
							src={"/images/icons/home.svg"}
							width={26}
							height={26}
							alt='packages'
						/>
						<span>Home</span>
					</Link>
					<Link
						href='/jobs'
						onClick={toggleMenu}
						className={`flex items-center gap-1 md:hidden ${pathname === '/jobs' && 'text-[#006c53]'}`}
					>
						<Image
							className='w-5 h-5 package-image'
							src={"/images/icons/findJob.svg"}
							width={26}
							height={26}
							alt='packages'
						/>
						<span>Find a job</span>
					</Link>
					<Link
						href='/post-job-info'
						onClick={toggleMenu}
						className={`flex items-center gap-1 md:hidden ${pathname === '/post-job-info' && 'text-[#006c53]'}`}
					>
						<Image
							className='w-5 h-5 package-image'
							src={"/images/icons/listing.svg"}
							width={26}
							height={26}
							alt='packages'
						/>
						<span>Post a job</span>
					</Link>
					<Link
						href='/packages'
						onClick={toggleMenu}
						className={`flex items-center gap-1 md:hidden ${pathname === '/packages' && 'text-[#006c53]'}`}
					>
						<Image
							className='w-5 h-5 package-image'
							src={"/images/icons/package-icon.svg"}
							width={26}
							height={26}
							alt='packages'
						/>
						<span>Packages</span>
					</Link>
					<Link
						href='/contact'
						onClick={toggleMenu}
						className={`flex items-center gap-1 lgl:hidden ${pathname === '/contact' && 'text-[#006c53]'}`}
					>
						<Image
							className='w-5 h-5 package-image'
							src={"/images/icons/contact.svg"}
							width={26}
							height={26}
							alt='contact us'
						/>
						<span>Contact us</span>
					</Link>
					<Link
						href='/post-resume'
						onClick={toggleMenu}
						className={`flex items-center gap-1 lgl:hidden ${pathname === '/contact' && 'text-[#006c53]'}`}
					>
						<Image
							className='w-5 h-5 package-image'
							src={"/images/icons/add.svg"}
							width={26}
							height={26}
							alt='post resume'
						/>
						<span>Post resume</span>
					</Link>
				</nav>
				<div className="mt-6 lgl:inline">
					{status === 'authenticated' ? (
						<div className="flex gap-4 items-center">
							<Link
								href={'/dashboard'}
								className="border-2 border-[#006c53] py-[15px] 
							px-6 rounded-2xl hover:border-[#83cfbe] duration-300">
								<FaUser className="text-black w-7 h-7 cursor-pointer" />
							</Link>
							<div
								onClick={() => signOut()}
								className="border-2 border-[#006c53] py-2 px-4 rounded-2xl hover:border-[#83cfbe] duration-300">
								<RiDoorOpenFill className="text-black w-10 h-10 cursor-pointer" />
							</div>
						</div>
					) : (
						<LoginBtn />
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default TopHeader;
