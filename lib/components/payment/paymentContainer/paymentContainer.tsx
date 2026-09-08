"use client"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Button from "@/lib/components/button/button";
import { ServicePlanType } from "@/lib/types/componentTypes";
import styles from "./paymentContainer.module.scss";

import { FaStripe } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


const PaymentContainer = ({props}: any) => {
	const router = useRouter();
	const selectedPackage: ServicePlanType = useSelector((state: RootState) => state.packages.selectedPackage);
	const amount = selectedPackage.price;
    const currency = "CZK";
    const style = { layout: "vertical" };

	async function handleSubmit() {
		try {
			const response = await fetch("/jobs/api/checkout", {
				method: "POST",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					title: props?.title ? props?.title : selectedPackage?.title,
					price: props?.price ? props?.price : selectedPackage?.price,
					points: props?.points ? props?.points : selectedPackage?.points
				}),
			});

			console.log("Checkout response:", response);	

			const { url } = await response.json();
				if (url) {
				window.location.href = url; 
				} else {
				console.error("URL not found in response");
				}
			/* replace("/jobs");
			refresh(); */
		} catch (error: unknown) {
			console.log(error);
		}
	};


	//paypal logic
	const createOrder = async () => {
        const response = await fetch("/jobs/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: props?.title ? props?.title : selectedPackage?.title,
				price: props?.price ? props?.price : selectedPackage?.price,
				points: props?.points ? props?.points : selectedPackage?.points
            }),
        });

        const { id } = await response.json();
        return id;
    };


	const orderRecord = async () => {
		const response = await fetch("/jobs/api/paypal/order-record", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: props?.title ? props?.title : selectedPackage?.title,
				price: props?.price ? props?.price : selectedPackage?.price,
				points: props?.points ? props?.points : selectedPackage?.points
            }),
        });

		if (response.ok) {
			router.push('success');
		} else {
			toast((t) => (
				<span className="flex flex-col gap-4 text-red-400 text-center items-center mb-2">
				  <span className="font-medium">
					Payment failed.
				  </span>
				  <button onClick={() => toast.dismiss(t.id)}>
					close
				  </button>
				</span>
			  ));
		}
	}


	return (
		<section className={styles["payment-container"]}>
			<div className={styles["payment-container__labels"]}>
				<label className={styles["payment-container__labels__label"]}>
					Checkout<span>*</span>
				</label>
				<label className={styles["payment-container__labels__subLabel"]}>
					<div className="flex items-center gap-1 text-sm sm:text-base">
						Go to secure payment page powered by
						<FaStripe  className="w-9 h-9 text-[#cc0303]"/>
					</div>
				</label>

				<Button className="bg-[#a80202] text-white text-xl font-bold py-3 sml:py-4 max-w-[750px] rounded-xl" onClick={handleSubmit}>
					Pay with Credit Card
				</Button>

				 {/* Кнопка для PayPal */}
				 <div className="w-full mt-2">
					<PayPalScriptProvider 
					options={{ 
						clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
						components: "buttons",
						currency: "CZK",
						"disable-funding": "credit,card,p24",
					}}>
						<div className="">
							<PayPalButtons
								style={{ 
									layout: "vertical", 
									borderRadius: 12 
								}}
								disabled={false}
								forceReRender={[amount, currency, style]}
								fundingSource={undefined}
								createOrder={createOrder}
								onApprove={async (data) => {
									const res = await fetch(`/jobs/api/paypal/capture-order`, {
										method: "POST",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify({ orderId: data.orderID }),
									});
									if (res.status === 200) {
										console.log(res);
										await orderRecord();
									}
									
								}}
								onError={(err) => {
									console.error("PayPal error", err);
								}}
							/>
						</div>
					</PayPalScriptProvider>
				 </div>
			</div>
		</section>
	);
};

export default PaymentContainer;