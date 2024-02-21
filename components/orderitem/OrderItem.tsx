"use client";

import Image from "next/image";
import React, { useState } from "react";
import product1 from "../../images/producttestimage.svg";
import { constant } from "../../utils/constants";
import { Bars, LineWave } from "react-loader-spinner";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../config/firebase-config";

const OrderItem = (product) => {
  let productitem = product?.product;


  return (
    <div className="flex pr-2  py-2 sm:py-3 md:py-4 gap-4 sm:gap-6 md:gap-8 items-center w-full ">
      <div className="w-20 h-20 md:w-24 md:h-24  lg:w-[114px] lg:h-[114px]  aspect-square">
        <Image
          src={
            productitem?.img?.url?.toString()?.includes("assets/img")
              ? constant.errImage
              : productitem?.img?.url
          }
          onError={() => {
            console.log("IMAGEEEEEEEEEEEEEEEEEEEEEE ERRRORRRRRRRRRRRRRRRRRR");
          }}
          alt={productitem?.name || ""}
          width={1000}
          height={1000}
          className=" object-contain aspect-square "
        />
      </div>

      <div className="w-full flex flex-col lg:flex-row lg:gap-8 justify-between ">
        <div className="lg:w-[55%]  flex flex-col gap-1 md:gap-3">
          <h3 className="w-full  tracking-tight font-semibold text-black text-sm md:text-base leading-2 sm:leading-4 md:leading-6">
            {productitem?.name}
          </h3>
          <h3 className="text-neutral-600   font-semibold text-opacity-75 text-xs md:text-sm  tracking-tight">
            Qty: {productitem?.quantity}
          </h3>
        </div>
      </div>
    </div>
  );
};
export default OrderItem;
