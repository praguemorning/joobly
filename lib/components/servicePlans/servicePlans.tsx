import React from "react";
import styles from "./servicePlans.module.scss";
import PlanContainer from "@/lib/components/payment/planContainer/planContainer";
import { PLANS } from "@/lib/constant/constants";
import { PackageType } from "@/lib/types/componentTypes";

interface ServicePlansPropsTypes {
	setServicePlan: (value: PackageType) => void;
	servicePlan: PackageType;
}

const ServicePlans = ({ setServicePlan, servicePlan }: ServicePlansPropsTypes) => {
	const selectedPrice = Number(servicePlan?.price);
	const plans = PLANS.map((item) => ({
		...item,
		isActive: item.planPrice === selectedPrice,
	}));

	return (
		<section className={styles["service-plans"]}>
			<div className={styles["service-plans__labels"]}>
				<label className={styles["service-plans__labels__label"]}>
					Service Plans<span>*</span>
				</label>
			</div>
			<div className={'flex flex-col gap-4 lg:flex-row mdl:gap-10'}>
				{plans.map(({ logo, data, planPrice, title, isActive }, index) => (
					<PlanContainer
						onClick={() =>
							setServicePlan({
								title: `1 ${title} Job Post`,
								price: planPrice,
								points: 1,
								percent: "",
								value: `${planPrice} CZK`,
								active: true,
							})
						}
						key={index}
						isActive={isActive}
						title={title}
						data={data}
						logo={logo}
						planPrice={planPrice}
					/>
				))}
			</div>
		</section>
	);
};

export default ServicePlans;
