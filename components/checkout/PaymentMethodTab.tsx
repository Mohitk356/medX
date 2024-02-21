import React, { useState } from "react";
import { paymentMethods, tabs } from "../../utils/utilities";
import FlatIcon from "../flatIcon/flatIcon";
import Image from "next/image";

const PaymentMethodTab = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  userAddress,
  setSelectedTab,
  setCompletedSteps,
}) => {

  console.log('sate',userAddress?.state);
  
  return (
    <div className="flex flex-col mt-1 w-full">
      <h6 className="font-medium  text-base text-neutral-400">
        Choose your preferred Payment Method
      </h6>
      <div className="flex flex-col gap-2 mt-10">
        {paymentMethods.map((method, idx) => {
          if (method.value === "cash" && userAddress?.state !== "Dubai") {
            return <></>;
          }
          return (
            <div
              onClick={() => {
                setSelectedPaymentMethod(method.value);
              }}
              className="flex justify-between items-center px-6 py-4 bg-white rounded-br-[15px] border border-neutral-300 cursor-pointer h-[54px] md:h-[72px]"
              key={idx}
            >
              <div className="flex gap-8 items-center">
                <div className="w-7 h-7">
                  <Image
                    src={
                      method?.value === "cash"
                        ? require("../../images/cod.png")
                        : require("../../images/credit-card (2) 1.png")
                    }
                    alt="cod"
                    width={1000}
                    height={1000}
                    className="object-contain"
                  />
                </div>
                <p className="text-black text-sm sm:text-base md:text-lg font-semibold">
                  {method.name}
                </p>
              </div>
              <div className="flex gap-1 md:gap-4">
                {selectedPaymentMethod === method.value && <p>✔️</p>}
                <FlatIcon className="flaticon-arrow-right text-primary font-bold text-xl" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodTab;
