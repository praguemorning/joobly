"use client"
import "./header.scss";
import { FaUser } from "react-icons/fa";
import { MdContactMail, MdWork, MdList, MdCardGiftcard, MdAdd } from "react-icons/md";
import { motion } from "framer-motion";
import { RiDoorOpenFill } from "react-icons/ri";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import Button from "../button/button";
import Link from "next/link";
import Image from "next/image";
import jobsLogo from "@/public/images/logos/prague-morning-jobs.svg";
import LoginBtn from "../loginBtn/loginBtn";

const TopHeader = () => {
	const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
	const { signOut: clerkSignOut } = useClerk();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [signingOut, setSigningOut] = useState(false);
	const pathname = usePathname();

	const handleSignOut = async (e?: MouseEvent) => {
		// Mobile drawer wraps content in an onClick that closes the menu;
		// stop that from racing with sign-out.
		e?.preventDefault();
		e?.stopPropagation();
		if (signingOut) return;

		setSigningOut(true);
		const home = `${window.location.origin}/jobs`;

		// Clear legacy NextAuth/local leftovers so the Log in button
		// cannot flip back to the old UserMenu after Clerk signs out.
		localStorage.removeItem("token");
		localStorage.removeItem("user");

		try {
			// Production keeps the real session on clerk.praguemorning.cz
			// (HttpOnly). We must let this finish — a reload before it
			// completes just handshakes a new __session and you look
			// "still logged in". Dev is fast enough that this rarely shows.
			await Promise.race([
				// Do not pass redirectUrl here; if Clerk rejects redirect_url
				// (4xx), the promise can stall and the button stays disabled.
				clerkSignOut(),
				new Promise<never>((_, reject) =>
					window.setTimeout(() => reject(new Error("signOut timed out")), 12000),
				),
			]);
			window.location.replace(home);
		} catch (err) {
			console.error("Sign out failed:", err);
			setSigningOut(false);
		}
	};

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const menuVariants = {
		open: { opacity: 1, x: 0 },
		closed: { opacity: 0, x: "-100%" },
	};

	const lineVariants = {
		open: {
			top: 8,
			rotate: 45,
			backgroundColor: "#a80202",
		},
		middleHidden: { opacity: 0 },
		closeTop: {
			top: 0,
			rotate: 0,
			backgroundColor: "#a80202",
		},
		closeBottom: {
			top: 16,
			rotate: 0,
			backgroundColor: "#a80202",
		}
	};

	return (
		<div className='header'>
			<div className='header-top'>
				<div className='search-post-group flex gap-2 -ml-3 xl:gap-10 items-center'>
					{/* The section's identity: Prague Morning's logo row is hidden on
					    these pages, so this stands in for it. */}
					<Link href='/' className='jobs-wordmark shrink-0'>
						<Image src={jobsLogo} alt='Prague Morning Jobs' height={44} priority />
					</Link>
					{/*<input type="text" className='header-search' placeholder='Company, Job Title...' />*/}
					{/*hеader nav links*/}
					{!isMenuOpen && (
						<div className="jobs-nav text-lg hidden md:flex gap-6 lg:gap-4 xl:gap-8 text-baseBlack50">
							<Link href='/' className={`flex items-center gap-1 ${pathname === '/' && 'text-black'}`}>
								<MdWork className='w-5 h-5 package-image' />
								<span className="text-nowrap">Find a job</span>
							</Link>
							<Link href='/post-job-info' className={`flex items-center gap-1 ${pathname === '/post-job-info' && 'text-black'}`}>
								<MdList className='w-5 h-5 package-image' />
								<span className="text-nowrap">Post a job</span>
							</Link>
							<Link href='/packages' className={`flex items-center gap-1 ${pathname === '/packages' && 'text-black'}`}>
								<MdCardGiftcard className='w-5 h-5 package-image' />
								<span className="text-nowrap">Packages</span>
							</Link>
						</div>
					)}
				</div>
				<div className='post-btn-group'>
					<Link href={"/contact"}>
						<Button
							style={{ maxWidth: "227px", height: "62px", borderRadius: "18px", gap: "10px" }}
							className={`btn-green-outlined`}
						>
							<MdContactMail className="w-6 h-6 mr-2" />
							Contact us
						</Button>
					</Link>

					<div className="hidden lgl:flex">
						{!clerkLoaded ? null : isSignedIn ? (
							<div className="flex gap-4 items-center">
								<Link
									href={'/dashboard'}
									className="border-2 border-[#a80202] py-[15px] 
								px-6 rounded-2xl hover:border-[#e3e4e8] duration-300">
									<FaUser className="text-black w-7 h-7 cursor-pointer" />
								</Link>
								<button
									type="button"
									aria-label="Log out"
									disabled={signingOut}
									onClick={(e) => void handleSignOut(e)}
									className="border-2 border-[#a80202] py-2 px-4 rounded-2xl hover:border-[#e3e4e8] duration-300 disabled:opacity-60">
									<RiDoorOpenFill className="text-black w-10 h-10" />
								</button>
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
						className={`flex items-center gap-3 lgl:hidden ${pathname === '/' && 'text-[#a80202]'}`}
					>
						<MdWork className='w-5 h-5 package-image' />
						<span>Find a job</span>
					</Link>
					<Link
						href='/post-job-info'
						onClick={toggleMenu}
						className={`flex items-center gap-3 lgl:hidden ${pathname === '/post-job-info' && 'text-[#a80202]'}`}
					>
						<MdList className='w-5 h-5 package-image' />
						<span>Post a job</span>
					</Link>
					<Link
						href='/packages'
						onClick={toggleMenu}
						className={`flex items-center gap-3 lgl:hidden ${pathname === '/packages' && 'text-[#a80202]'}`}
					>
						<MdCardGiftcard className='w-5 h-5 package-image' />
						<span>Packages</span>
					</Link>
					<Link
						href='/contact'
						onClick={toggleMenu}
						className={`flex items-center gap-3 lgl:hidden ${pathname === '/contact' && 'text-[#a80202]'}`}
					>
						<MdContactMail className='w-5 h-5 package-image' />
						<span>Contact us</span>
					</Link>
				</nav>
				<div className="mt-6 lgl:inline">
					{!clerkLoaded ? null : isSignedIn ? (
						<div className="flex gap-4 items-center">
							<Link
								href={'/dashboard'}
								className="border-2 border-[#a80202] py-[15px] 
							px-6 rounded-2xl hover:border-[#e3e4e8] duration-300">
								<FaUser className="text-black w-7 h-7 cursor-pointer" />
							</Link>
							<button
								type="button"
								aria-label="Log out"
								disabled={signingOut}
								onClick={(e) => void handleSignOut(e)}
								className="border-2 border-[#a80202] py-2 px-4 rounded-2xl hover:border-[#e3e4e8] duration-300 disabled:opacity-60">
								<RiDoorOpenFill className="text-black w-10 h-10" />
							</button>
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
