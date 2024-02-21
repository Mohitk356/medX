"use client";
import Image from "next/image";
import React from "react";
import { constant } from "../../utils/constants";
import NextBreadcrumbs from "../../components/breadCrumb/NextBreadCrumb";

const whyChooseUs = [
  {
    icon: "24Hour",
    title: "24 HOURS PHARMACY",
    desc: "Our 4 retail outlets in Dubai offer service 24/7, such as details about products, delivery requests, etc.",
  },
  {
    icon: "homeDelivery",
    title: "24 HOURS – FREE HOME DELIVERY",
    desc: "We provide free home delivery in the Emirates of Dubai and Sharjah within 24 hours. T&C Apply.",
  },
  {
    icon: "accurateDelivery",
    title: "FAST & ACCURATE DELIVERY",
    desc: "In order for us to guarantee timely and accurate delivery of all orders, we ensure that they are processed accurately.",
  },
  {
    icon: "tollFree",
    title: "TOLL FREE NO: 800-700-500",
    desc: "TOLL FREE NO: 800-700-500 : Please contact us by calling Toll-Free 800-700-500 or by emailing info@medxpharmacy.com",
  },
  {
    icon: "assistance",
    title: "24 HOURS PHARMACIST ASSISTANCE",
    desc: "If you need assistance with your medication, our well-trained pharmacists are available on-site or by phone 24 hours a day.",
  },
  {
    icon: "stockList",
    title: "LARGEST NUTRITION STOCKISTS",
    desc: "Our stockists keep only the best Sports Nutrition brands and Vitamins from around the world.",
  },
  {
    icon: "consultation",
    title: "FREE NUTRITIONAL CONSULTATION",
    desc: "We provide expert nutrition and supplement advice to professional athletes and health enthusiasts.",
  },
];

const WhyChooseUsClient = () => {
  // Assuming `fetchAPI` loads data from the API and this will use the
  // parameter name to determine how to resolve the text. In the example,
  // we fetch the post from the API and return it's `title` property

  return (
    <div className="flex flex-col px-body gap-4 my-4">
      {/* <NextBreadcrumbs
      /> */}
      <h1 className=" text-2xl lg:text-4xl font-semibold">Why Choose MedX</h1>
      <div className="flex flex-col  gap-3">
        {whyChooseUs.map((item, idx) => {
          return (
            <div className="flex gap-2 border-b px-body border-gray-300 py-6">
              <div className=" w-[25%] lg:w-[30%] flex justify-center items-center ">
                <div className="w-[40%]  lg:w-[30%]">
                  <Image
                    src={
                      require(`../../images/${item.icon}.png`) ||
                      constant.errImage
                    }
                    width={1000}
                    height={1000}
                    alt="icon"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2 justify-center items-center w-full ">
                <h3 className="text-xl lg:text-2xl font-semibold text-center">
                  {item.title}
                </h3>
                <p className="text-center">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhyChooseUsClient;
