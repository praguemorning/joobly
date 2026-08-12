import React from "react";
import Paper from "@/lib/components/paper/Paper";
import Image from "next/image";
import styles from "./planContainer.module.scss";
import PlanPermissions from "@/lib/components/payment/planContainer/planPermissions/planPermissions";
import Button from "@/lib/components/button/button";
import { PlanContainerDataType } from "@/lib/types/componentTypes";
interface PlanContainerPropsTypes extends PlanContainerDataType {
	onClick: () => void;
}

const PlanContainer = ({
	logo,
	planPrice = 0,
	data,
	title,
	onClick,
	isActive,
}: PlanContainerPropsTypes) => {

	return (
			<section
			className={`p-6 w-full 
				${title === "Gold" ? "bg-black" : "bg-inputBg"} rounded-xl border-2 
				flex flex-col justify-between
				${isActive ? "border-[#cc0303]" : "border-white"}
			`}
			>
				<div>
					<div className={"flex gap-2 items-center"}>
						<Image width={48} height={48} src={logo} alt='logo' />
						<h1
							className={`${'text-lg font-semibold'} ${
								title === "Gold" && "text-white"
							}`}
						>
							{title}
						</h1>
					</div>
					<p
						className={`${'text-md mt-4'} ${
							title === "Gold" && "text-white"
						}`}
					>
						{planPrice} CZK
					</p>
					<p
						className={`${'text-sm mt-2 text-gray-500'}  ${
							title === "Gold" && styles["text-black"]
						}`}
					>
						{title === "Bronze"
							? "The free plan gives you access to some of the great features of Gostart."
							: null}
					</p>
					<PlanPermissions title={title} data={data} />
				</div>
				<div>
					<div className="mt-6 flex items-center justify-center">
						<Button
							onClick={onClick}
							style={{ width: "100%", height: "56px" }}
							className={
								title ===  "Premium" ? `btn-plans-white green-text` : `btn-green-outlined green-text`
							}
						>
							Select
						</Button>
					</div>
				</div>
			</section>
	);
};

export default PlanContainer;
