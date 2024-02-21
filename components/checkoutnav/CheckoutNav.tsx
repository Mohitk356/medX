"use client";
import React, { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../images/logo.png";
import FlatIcon from "../flatIcon/flatIcon";

const CheckoutNav = () => {
  return (
    <>
      <div
        className={`text-center  border-b border-gray-200 justify-between flex items-center py-5`}
      >
        <div className="w-[130px] sm:w-[150px] md:w-[180px] ">
          <Link href={"/"}>
            <Image
              src={logo}
              alt="loading"
              height={1000}
              width={1000}
              // style={{ aspectRatio: "auto", width: "100px", height: "auto" }}
              className="w-full h-auto"
            />
          </Link>
        </div>

        <div className="">
          <p className=" font-semibold text-xl sm:text-2xl md:text-3xl ">
            Checkout
          </p>
        </div>
      </div>
    </>
  );
};
export default CheckoutNav;
