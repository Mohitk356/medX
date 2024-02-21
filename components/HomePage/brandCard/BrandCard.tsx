"use client";
import Image from "next/image";
import React, { useState } from "react";
import { constant } from "../../../utils/constants";
import Link from "next/link";

const BrandCard = ({ brand, isHovered }: any) => {
  const [image, setImage] = useState(brand?.image?.url || constant.errImage);
  return (
    <Link href={`/product-category/brands/${brand?.slug?.name}`}>
      <div
        className="relative  flex justify-center items-center   cursor-pointer mx-2  
      "
      >
        <div className=" lg:w-[100px] lg:h-[100px] flex justify-center items-center">
          <Image
            alt={brand?.name || ""}
            src={image}
            onError={() => {
              setImage(constant.errImage);
            }}
            width={1000}
            height={1000}
            className=" object-fit h-full w-full  "
          />
        </div>
        {/* <div className=" h-16 w-16 border border-gray-700 flex justify-center items-center ">
          <Image
            alt={brand?.name || ""}
            src={image}
            onError={() => {
              setImage(constant.errImage);
            }}
            layout="responsive"
            width={1000}
            height={1000}
            className=" object-fit  h-full w-full  "
          />
        </div> */}
        {/* {isHovered === brand?.id && (
          <div className="absolute w-full bottom-[5px] left-0 flex justify-center">
            <div className="py-1 md:py-2 bg-primary rounded-full w-[95%] flex justify-center opacity-80">
              <h4 className="text-lg font-semibold text-white">
                {brand?.name}
              </h4>
            </div>
          </div>
        )} */}
      </div>
    </Link>
  );
};
export default BrandCard;
