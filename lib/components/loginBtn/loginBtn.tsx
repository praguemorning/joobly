"use client";
import Link from "next/link";
import Button from "../button/button";
import UserMenu from "./userMenu";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";

const LoginBtn = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);
	return (
		<>
			{user ? (
				<UserMenu
					user={user}
					items={[
						{ id: "1", label: "Profile", path: "/profile" },
						{ id: "2", label: "Jobs", path: "/" },
						{ id: "3", label: "Log Out", path: "/" },
					]}
				/>
			) : (
				<Link href='/login'>
					<Button
						style={{ maxWidth: "227px", height: "62px", borderRadius: "18px", gap: "10px" }}
						className='btn btn-green-outlined'
					>
						<FaRegUser className="-ml-2"/>
						Log in
					</Button>
				</Link>
			)}
		</>
	);
};

export default LoginBtn;

{
	/* <Button
					style={{ maxWidth: "227px", height: "62px", borderRadius: "18px", gap: "10px" }}
					onClick={() => {
						localStorage.removeItem("token");
						localStorage.removeItem("user");
						window.location.reload();
					}}
					className='btn btn-green-outlined'
				>
					Log Out
				</Button> */
}
