"use client";
import React from "react";
import Image from "next/image";
import FlatIcon from "../flatIcon/flatIcon";
import ContactForm from "../contactform/ContactForm";
import { useQuery } from "@tanstack/react-query";
import {
    getStoreDetails,
} from "../../utils/databaseService";

const ContactInfo = () => {

  const { data: storeData } = useQuery({
    queryKey: ["storeDetails"],
    queryFn: () => getStoreDetails(),
    refetchInterval: 2000,
    keepPreviousData: true,
  });


  return (
    <div className="flex  flex-col md:flex-row   w-full ">
      <div className="bg-[white] text-black w-full  md:w-[45%]  pt-[30px] md:pb-[60px] md:pt-[60px] px-body font-medium ">
        <div className=" border-l border-[#f3f3f2] pl-1 md:pl-8 h-full w-full ">
          <div className=" my-1">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#929198]">
              Address Details
            </h1>
          </div>

          <div className=" my-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Contact Us</h1>
          </div>
          <div className="flex flex-col gap-5 mt-6">
            <div className="flex items-center gap-2 text-xl ">
              <FlatIcon className={"flaticon-address h-6 w-6 text-[#ED1B24]"} />
              <div className="text-base">
                  {(storeData && storeData?.storeAddress?.address) || ""}
                </div>
            </div>

            <a
          href={`mailto:${storeData && storeData?.storeEmail}`}>
            <div className="flex items-center gap-2 text-xl ">
              <FlatIcon className={"flaticon-email h-6 w-6 text-[#ED1B24]"} />
              <div className="text-base">
                  {(storeData && storeData?.storeEmail) || ""}
                </div>
            </div>
            </a>

            <a href={`https://wa.me/${storeData && storeData?.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer">
            <div className="flex items-center gap-2 text-xl">
              <FlatIcon
                className={"flaticon-whatsapp-1 h-6 w-6 text-[#ED1B24]"}
              />
             <div className="text-base">
                  {(storeData && storeData?.whatsappNumber) || ""}
                </div>
            </div>
           </a>

           <a href={`tel:${storeData && storeData?.storePhone}`}>
            <div className="flex items-center gap-2 text-xl">
              <FlatIcon className={"flaticon-phone h-6 w-6 text-[#ED1B24]"} />
              <div className="text-base">
                  {" "}
                  {(storeData && storeData?.storePhone) || ""}
                </div>
            </div>
            </a>
            
          </div>
        </div>
      </div>

      <div className="bg-[white] text-black w-full md:w-[55%] pb-[60px]  pt-[60px] px-body font-medium h-full">
        <div className="  pl-1 md:pl-8 h-full w-full border-l border-[#f3f3f2]">
          <div className=" my-1">
            <h1 className="text-base sm:text-lg md:text-xl font-semibold text-[#929198]">
              Still need help?
            </h1>
          </div>

          <div className=" my-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Get in touch with us</h1>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
