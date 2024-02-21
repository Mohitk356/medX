"use client";
import Image from "next/image";
import React, { useState } from "react";
import { constant } from "../../../utils/constants";

const ServiceCard = ({ service }) => {
  const [image, setImage] = useState(service?.banner?.url || constant.errImage);

  return (
    // <div className="flex flex-col gap-2 w-full max-w-[250px] items-center justify-center p-4 shadow-md rounded-lg cursor-pointer">
    <div className="flex flex-col gap-2 items-center justify-center p-4 shadow-md rounded-lg cursor-pointer">
      <div className="h-[200px]">
        <Image
          alt={service?.name || ""}
          src={image}
          width={1000}
          onError={() => {
            setImage(constant.errImage);
          }}
          height={1000}
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold ">{service?.name}</h4>
      </div>
    </div>
  );
};

export default ServiceCard;
