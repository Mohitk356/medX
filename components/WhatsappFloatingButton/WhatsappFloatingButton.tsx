"use client";
import React from "react";
import FlatIcon from "../flatIcon/flatIcon";
import Link from "next/link";

const WhatsappFloatingButton = () => {
  return (
    <Link href={`https://wa.me/+971522048625`} target="_blank">
      <div className="fixed bottom-6 right-6  p-3 rounded-full flex justify-center items-center bg-[#49e670] shadow-md">
        <FlatIcon className="flaticon-whatsapp-1 text-white text-3xl"></FlatIcon>
      </div>
    </Link>
  );
};

export default WhatsappFloatingButton;
