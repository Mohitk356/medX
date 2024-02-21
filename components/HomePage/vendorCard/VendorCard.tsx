"use client";
import Image from "next/image";
import React, { useState } from "react";
import { constant } from "../../../utils/constants";

const VendorCard = ({ vendor }) => {
  const [image, setImage] = useState(vendor?.image?.url || constant.errImage);
  return (
    // <div className="flex flex-col gap-2 w-full max-w-[250px] items-center justify-center p-4 shadow-md rounded-lg cursor-pointer">
    <div className="flex flex-col gap-2 items-center justify-center p-4 shadow-md rounded-lg cursor-pointer">
      <div className="h-[200px]">
        <Image
          alt={vendor?.name || ""}
          src={image}
          onError={() => {
            setImage(constant.errImage);
          }}
          width={1000}
          height={1000}
          className="h-full object-fit"
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold ">{vendor?.name}</h4>
      </div>
    </div>
  );
};

export default VendorCard;
