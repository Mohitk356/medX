"use client";
import { usePathname } from "next/navigation";
import React from "react";
import styled, { keyframes } from "styled-components";
import { LineWave } from "react-loader-spinner";
import logo from "../../images/logo.png";
import Image from "next/image";

// const breatheAnimation = keyframes`
//   0% { transform: scale(1); }
//   50% { transform: scale(1.2); }
//   100% { transform: scale(1); }
// `;

// const BreathingLogo = styled.img`
//   animation: ${breatheAnimation} 3s infinite;
//   width: 150px; // Set the width of your logo as per your design
//   height: auto; // Maintain aspect ratio
// `;

const Loading = () => {
  const pathname = usePathname();
  return (
    <div
      className={`w-full h-full fixed top-0 left-0  flex items-center justify-center `}
    >
      <div className=" flex-col gap-2 w-[40%] md:w-[20%] h-auto">
        <Image
          src={logo}
          alt="logo"
          className=" breathing-animation"
          width={200}
          height={200}
          layout="responsive"
        />
        {/* <p className="text-center">Loading...</p> */}
      </div>

      {/* <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div> */}
    </div>
  );
};

export default Loading;
