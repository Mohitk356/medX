"use client";
import { usePathname } from "next/navigation";
import React from "react";
import styled, { keyframes } from "styled-components";
import { LineWave } from "react-loader-spinner";
import logo from "../images/logo.png";
import Image from "next/image";

const Loading = () => {
  const pathname = usePathname();
  return (
    <div className={`w-full min-h-[70vh]  flex items-center justify-center `}>
      <div className=" flex-col gap-2 w-[40%] md:w-[20%] h-auto">
        <Image
          src={logo}
          alt="loading"
          className=" breathing-animation"
          width={200}
          height={200}
          layout="responsive"
        />
      </div>
    </div>
  );
};

export default Loading;
