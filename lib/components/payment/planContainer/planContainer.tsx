import Button from "@/lib/components/button/button";
import PlanPermissions from "@/lib/components/payment/planContainer/planPermissions/planPermissions";
import { PlanContainerDataType } from "@/lib/types/componentTypes";
import Image from "next/image";
import styles from "./planContainer.module.scss";

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
  const isGold = title === "Gold";

  return (
    <section
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`p-6 w-full cursor-pointer
				${isGold ? "bg-black" : "bg-inputBg"} rounded-xl border-2 
				flex flex-col justify-between
				${isActive ? "border-[#cc0303]  ring-2 ring-[#cc0303]/30" : "border-white"}
			`}
    >
      <div>
        <div className={"flex gap-2 items-center"}>
          <Image width={48} height={48} src={logo} alt="logo" />
          <h1
            className={`${"text-lg font-semibold"} ${isGold && "text-white"}`}
          >
            {title}
          </h1>
        </div>
        <p className={`${"text-md mt-4"} ${isGold && "text-white"}`}>
          {planPrice} CZK
        </p>
        <p
          className={`${"text-sm mt-2 text-gray-500"}  ${
            isGold && styles["text-black"]
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
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            style={{ width: "100%", height: "56px" }}
            className={
              isActive
                ? "bg-[#cc0303] text-white rounded-xl  border border-[#cc0303]"
                : "btn-green-outlined green-text"
            }
          >
            {isActive ? "Selected" : "Select"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PlanContainer;
