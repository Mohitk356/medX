"use client";
import React, { useEffect, useState } from "react";
// import {CiLocationOn} from "react-icons/ci"
// import {BsTelephone} from 'react-icons/bs'
// import {CiMail} from "react-icons/ci"
// import {BsClock} from "react-icons/bs"
// import farmacyLogo from "../../images/Farmacylogo (1).svg"
import logo from "../../images/MedX-Pharmacy-Logo-R-01 2 (1).svg";
// import {FaInstagram} from "react-icons/fa"
// import {RiLinkedinFill} from "react-icons/ri"
// import {RiFacebookFill} from "react-icons/ri"
// import {BsTwitter} from "react-icons/bs"
import Image from "next/image";
import img1 from "../../images/Frame 34376-1.png";
import img2 from "../../images/Frame 34376.png";
import img3 from "../../images/Frame 34375.png";
import img4 from "../../images/image 134 (1).png";
import img5 from "../../images/image 136.png";
import img6 from "../../images/Frame 34376-2.png";
import FlatIcon from "../flatIcon/flatIcon";
import { useQuery } from "@tanstack/react-query";
import { FaTiktok } from "react-icons/fa";
import img7 from "../../images/return-box 2.svg";
import imag8 from "../../images/express-delivery.svg";
import imag9 from "../../images/card.svg";
import imag10 from "../../images/brand 1.svg";
import imag11 from "../../images/trust (1) 1 1.svg";
import {
  BsTwitter,
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsYoutube,
} from "react-icons/bs";
import {
  fetchCategories,
  fetchPolicies,
  getCountries,
  getStoreDetails,
} from "../../utils/databaseService";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Footer = () => {
  const pathName = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });
  const { data: storeData } = useQuery({
    queryKey: ["storeDetails"],
    queryFn: () => getStoreDetails(),
    keepPreviousData: true,
  });
  const { data: policies } = useQuery({
    queryKey: ["policies"],
    queryFn: () => fetchPolicies(),
    keepPreviousData: true,
  });
  const DUMMY_DATA = [
    {
      heading: "COMPANY",
      subLinks: [
        { name: "About Us", href: "/about-us" },
        { name: "Contact Us", href: "/contact-us" },
        { name: "Careers", href: "/careers" },
        { name: "Why Choose Us", href: "/why-choose-us" },
        { name: "Store Locations", href: "/store-locations" },
        { name: "Become a Partner", href: "/become-a-partner" },
        { name: "Customer Help", href: "/customer-help" },
      ],
    },
    {
      heading: "POPULAR CATEGORIES",
      subLinks: [
        { name: "Personal Care" },
        { name: "Medical Essentials" },
        { name: "Nutrition & Supplements" },
        { name: "Beauty Care" },
        { name: "Sport Nutrition" },
        { name: "Mother & Baby Care" },
        { name: "Clearance Sale" },
      ],
    },
    {
      heading: "ACCOUNT",
      subLinks: [
        { name: "Track Order", href: "/track-order" },
        { name: "Delivery & Shipping", href: "/delivery-and-shipping" },
        { name: "Return & Refund", href: "/return-&-refund" },
        { name: "Terms & Conditions", href: "/terms-&-conditions" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        {
          name: "Health Information Center",
          href: "/health-information-center",
        },
        // { name: "Wishlist" },
        // { name: "Help Info Center" },
      ],
    },
  ];
  const images = [
    { image: img4 },
    { image: img3 },
    { image: img5 },
    { image: img2 },
    { image: img1 },
    { image: img6 },
  ];
  // const data2=[{heading:"sfgfdgh",subLinks:[{icon:<CiLocationOn/>,darkKey:"Address",name:"1752 School House Road"},
  // {icon:<BsTelephone/>,darkKey:"Call Us",name:"1733-5565-5465"},
  // {icon:<CiMail/>,darkKey:"Email",name:"farmacy@contact.com"},
  // {icon:<BsClock/>,darkKey:"Work Hours",name:"8:00-20:00,Sunday-Thursday"},
  // // {icon:<CiLocationOn/>,darkKey:"Address",name:"1752 School House Road"}
  // ]}]

  // const SOCIAL_MEDIA=[{icon:<RiFacebookFill/>},{icon:<RiLinkedinFill/>},{icon:<FaInstagram/>},{icon:<BsTwitter/>}]
  const dummyData2 = [
    {
      image: imag8,
      heading: "Free & Fast Delivery",
      text: "We deliver within 48 hours!",
    },
    {
      image: imag10,
      heading: "1000 + Brands",
      text: "Premium & Quality Assured Products",
    },
    {
      image: imag11,
      heading: "5+ Years Of Trust",
      text: "Meeting Customers Expectations",
    },
    {
      image: imag9,
      heading: "Secure Payments",
      text: "Visa, MasterCard, Apple Pay",
    },
    {
      image: img7,
      heading: "Easy Return Policy",
      text: "Satisfaction Guaranteed",
    },
  ];
  return (
    <div className={`h-fit ${pathName === "/checkout" && "hidden"} `}>
      <div className="px-body bg-[#1B1B1B] py-8 border-b-[1px] border-[#484848] ">
        {/* <div className="sm:flex sm:flex-row flex-col justify-center items-center gap-10 flex-wrap grid grid-cols-1 "> */}
        <div className="grid xl:grid-cols-5 lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-5 ">
          {dummyData2.map((item: any, idx: number) => {
            return (
              <div
                className="flex items-center gap-x-2"
                key={item?.heading + idx}
              >
                <div className="h-10 w-14 ">
                  <Image
                    src={item.image}
                    alt="icon"
                    className="h-full w-full object-fit"
                  />
                </div>
                <div className="text-white flex flex-col gap-1 ">
                  <h2 className="text-base font-semibold">{item.heading}</h2>
                  <p className="line-clamp-2 text-sm font-medium">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex  flex-col lg:flex-row    w-full ">
        <div className="bg-[#EA1F27] text-white w-full lg:w-[37%] lg:pb-0 py-[30px] sm:py-[40px] md:py-[60px] px-body font-medium">
          <div className=" ml-[-6px] md:ml-[-15px]  min-w-[100px]  sm:w-[18%] lg:w-[33%] lg:max-w-[200px]">
            <Image
              src={logo}
              alt="logo"
              height={1000}
              width={1000}
              style={{ aspectRatio: "auto", width: "200px", height: "auto" }}
              className=" w-full h-full object-contain "
            />
          </div>
          <div className="text-sm">
            {/* <div className="text-sm leading-6">
              Ut enim ad minim veniam quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat nostrud exercitation.
            </div> */}

            <div className="text-xl font-medium my-4">Contact Us</div>
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
              <div className="flex items-center gap-2 text-xl ">
                <FlatIcon className={"flaticon-address"} />
                <div className="text-sm">
                  {(isClient &&
                    storeData &&
                    storeData?.storeAddress?.address) ||
                    ""}
                </div>
              </div>

              <a
                href={`mailto:${
                  isClient && storeData && storeData?.storeEmail
                }`}
              >
                <div className="flex items-center gap-2 text-xl ">
                  <FlatIcon className={"flaticon-email"} />
                  <div className="text-sm">
                    {(isClient && storeData && storeData?.storeEmail) || ""}
                  </div>
                </div>
              </a>

              <a
                href={`https://wa.me/${
                  isClient && storeData && storeData?.whatsappNumber
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-2 text-xl">
                  <FlatIcon className={"flaticon-whatsapp-1"} />
                  <div className="text-sm">
                    {(isClient && storeData && storeData?.whatsappNumber) || ""}
                  </div>
                </div>
              </a>

              <a href={`tel:${isClient && storeData && storeData?.storePhone}`}>
                <div className="flex items-center gap-2 text-xl">
                  <FlatIcon className={"flaticon-phone"} />
                  <div className="text-sm">
                    {(isClient && storeData && storeData?.storePhone) || ""}
                  </div>
                </div>
              </a>
              <div className="flex items-center gap-3 md:gap-4">
                {isClient && storeData?.tiktokUrl && (
                  <a href={storeData?.tiktokUrl} target="_blank">
                    <div className="flex items-center gap-2 text-xl">
                      <FaTiktok className={"md:text-2xl"} />
                    </div>
                  </a>
                )}
                {isClient && storeData?.twitterUrl && (
                  <a href={storeData?.twitterUrl} target="_blank">
                    <div className="flex items-center gap-2 text-xl">
                      <BsTwitter className={"md:text-2xl"} />
                    </div>
                  </a>
                )}
                {isClient && storeData?.instagramUrl && (
                  <a href={storeData?.instagramUrl} target="_blank">
                    <div className="flex items-center gap-2 text-xl">
                      <BsInstagram className={"md:text-2xl"} />
                    </div>
                  </a>
                )}
                {isClient && storeData?.facebookUrl && (
                  <a href={storeData?.facebookUrl} target="_blank">
                    <div className="flex items-center gap-2 text-xl">
                      <BsFacebook className={"md:text-2xl"} />
                    </div>
                  </a>
                )}
                {isClient && storeData?.linkedinUrl && (
                  <a href={storeData?.linkedinUrl} target="_blank">
                    <div className="flex items-center gap-2 text-xl">
                      <BsLinkedin className={"md:text-2xl"} />
                    </div>
                  </a>
                )}
                {isClient && storeData?.youtubeUrl && (
                  <a href={storeData?.youtubeUrl} target="_blank">
                    <div className="flex items-center gap-2 text-xl">
                      <BsYoutube className={"md:text-2xl"} />
                    </div>
                  </a>
                )}
              </div>

              {/* <div className="w-20 ">
                <Image
                  alt="Qr"
                  src={require("../../images/qrCode.png")}
                  width={1000}
                  height={1000}
                  layout="responsive"
                />
              </div> */}
            </div>
          </div>
        </div>

        <div
          className={`bg-[#1B1B1B] text-white w-full  lg:w-[63%] ${
            pathName?.includes("/product/") && "hidden md:block"
          }  `}
        >
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-14 py-[30px] sm:py-[40px] md:py-[60px] px-[6%] ">
            {/* <div ></div> */}
            {DUMMY_DATA.map((item: any, idx: number) => {
              if (item.heading === "POPULAR CATEGORIES") {
                return (
                  <div
                    className="w-full lg:w-1/3 flex flex-col gap-4 md:gap-7  "
                    key={idx + item?.heading}
                  >
                    <div className=" relative font-semibold text-base md:text-lg w-fit ">
                      {item.heading}
                      <div className="bg-[#EA1F27]   absolute bottom-[-8px] p-[1px] w-full lg:w-[55px] h-[1px]"></div>
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                      {isClient && categories && categories.length !== 0
                        ? categories.slice(0, 7)?.map((categoryData, idx) => {
                            let category = categoryData?.category;
                            return (
                              <Link
                                href={
                                  (category?.isSubcategories
                                    ? `/category/${category?.slug?.name}`
                                    : `/shop/category/${category?.slug?.name}`) ||
                                  "/#"
                                }
                                key={category?.id + Math.random()}
                              >
                                <div className="text-sm md:text-base ">
                                  {category.name}
                                </div>
                              </Link>
                            );
                          })
                        : item?.subLinks?.map((link, index) => {
                            return (
                              <div
                                className="text-sm md:text-base "
                                key={index * Math.random() + "footer-key"}
                              >
                                {link.name}
                              </div>
                            );
                          })}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  className="w-full lg:w-1/3 flex flex-col gap-4 md:gap-7  "
                  key={item?.heading}
                >
                  <div className=" relative font-semibold text-base md:text-lg w-fit ">
                    {item.heading}
                    <div className="bg-[#EA1F27]   absolute bottom-[-8px] p-[1px] w-full lg:w-[55px] h-[1px]"></div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                    {item.subLinks.map((item: any, idx: number) => {
                      return (
                        <Link
                          key={item?.href + "-FooterLink"}
                          href={item?.href || "/#"}
                        >
                          <div className="text-sm md:text-base ">
                            {item.name}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-b-[1px] border-[#484848] border-line"></div>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-center justify-between  py-5 px-[6%]">
            <div className="text-[#999999] text-sm md:text-base font-medium">
              © MedX Pharmacy, LLC. All rights reserved.
            </div>
            <div className="flex gap-3">
              {images.map((item: any, idx: number) => {
                return (
                  <div key={item?.image || idx + "Image-Key"}>
                    <Image
                      src={item.image}
                      alt="image"
                      height={1000}
                      width={1000}
                      style={{
                        aspectRatio: "auto",
                        width: "40px",
                        height: "22px",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
