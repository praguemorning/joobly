"use client";
import React, { useEffect } from "react";
import styles from "./paymenPage.module.scss";
import ServicePlans from "@/lib/components/servicePlans/servicePlans";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setPackage } from "@/lib/features/packageSlice/packageSlice";
import PaymentContainer from "@/lib/components/payment/paymentContainer/paymentContainer";
import { PLANS } from "@/lib/constant/constants";
import { PackageType } from "@/lib/types/componentTypes";

const basicPlan = PLANS[0];

const defaultPlan: PackageType = {
	title: `1 ${basicPlan.title} Job Post`,
	price: basicPlan.planPrice,
	points: 1,
	percent: "",
	value: `${basicPlan.planPrice} CZK`,
	active: true,
};

const Payment = () => {
	const dispatch = useDispatch();
	const selectedPackage = useSelector((state: RootState) => state.packages.selectedPackage);

	useEffect(() => {
		dispatch(setPackage(defaultPlan));
	}, [dispatch]);

	const handleServicePlanChange = (plan: PackageType) => {
		dispatch(setPackage(plan));
	};

	return (
		<section className={styles["payment-page"]}>
			<div className={styles["payment-page__wrapper"]}>
				<ServicePlans servicePlan={selectedPackage} setServicePlan={handleServicePlanChange} />
				{!!selectedPackage && <PaymentContainer props={selectedPackage} />}
			</div>
		</section>
	);
};

export default Payment;
