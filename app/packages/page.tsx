"use client";
import { PACKAGES, POST_PACKAGES_ACTIONS } from "@/lib/constant/constants";
import { PackageType } from "@/lib/types/componentTypes";
import { RootState } from "@/lib/store";
import { setPackage } from "@/lib/features/packageSlice/packageSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import Button from "@/lib/components/button/button";
import Image from "next/image";
import Link from "next/link";
import packagesBg from "../../public/images/packageBg.svg";
import PackagesCheckbox from "@/lib/components/packages/packagesCheckbox";
import packagesImg from "../../public/images/pakagesImg.jpg";
import packagesImg1 from "../../public/images/pakagesImg1.jpg";
import packagesImg2 from "../../public/images/pakagesImg2.jpg";
import packagesImg3 from "../../public/images/pakagesImg3.jpg";
import packagesImg4 from "../../public/images/pakagesImg4.jpg";
import PaymentContainer from "@/lib/components/payment/paymentContainer/paymentContainer";
import PostJobActions from "@/lib/components/postJobActions/postJobActions";
import styles from "./packagesPage.module.scss";
import { useRouter } from "next/navigation";

const PackagesPage = () => {
    const dispatch = useDispatch();
    const user = useSession();
    const router = useRouter();
    const selectedPackage = useSelector((state: RootState) => state.packages.selectedPackage);

    const changePackage = (packageInfo: PackageType) => {
        dispatch(setPackage(packageInfo));
    };

    return (
        <section className={styles["packages_page"]}>
            <div className={styles["about_contex"]}>
                <div className={styles["about_contex__list"]}>
                    <h1>Advantages</h1>
                    <PostJobActions data={POST_PACKAGES_ACTIONS} color="black" />
                </div>
                <div className={styles["about_contex__image"]}>
                    <Image src={packagesImg} width={600} height={400} alt="Package's Background" />
                </div>
            </div>
            <div className={styles["packages-page__wrapper"]}>
                <label className={styles["components_head"]}>Select your package</label>

                {PACKAGES?.map((item, index) => (
                    <PackagesCheckbox
                        key={index}
                        title={item.title}
                        price={item.price}
                        points={item.points}
                        percent={item.percent}
                        value={item.value}
                        checked={selectedPackage.title === item.title}
                        onChange={changePackage}
                    />
                ))}
            </div>
            {user?.data?.user ? (
                <PaymentContainer />
            ) : (
                <div className="flex justify-start items-center">
                    <Button className="bg-[#006c53] text-white text-xl font-bold py-3 sml:py-4 max-w-[750px] rounded-xl p-10" onClick={() => router.push('/login')}>
                        Login to proceed to payment
                    </Button>
                </div>
            )}
            <label className={styles["ending_text_head"]}> Want to post more?</label>
            <p className={styles["ending_text"]}>
                Please <Link className="text-[#006c53] underline hover:text-[#009c77] duration-200" href="/contact">contact</Link> us and we will find a personalized solution for you.
            </p>
        </section>
    );
};

export default PackagesPage;