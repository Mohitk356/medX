import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { constant } from "../../utils/constants";
// import btnBg from "../../images/Rectangle 24048.svg"
import discountBg from "../../images/Vector (2).svg";
import btnBg from "../../images/image (8).png";

const CategoryCard = ({ cat, heading, slug }) => {
  return (
    <Link
      href={
        cat?.isSubcategories
          ? `/category/${cat?.slug?.name}`
          : `/category-product/${cat?.slug?.name}`
      }
    >
      {/* <Link href={`/category-product/${cat?.slug?.name}`}> */}
      <div className="flex flex-col  mx-1 relative ">
        <div className=" relative rounded-br-3xl mb-0 sm:mb-1 md:mb-2">
          <div className="h-auto sm:p-1 md:p-2 rounded-tl-2xl  rounded-br-3xl ">
            <Image
              src={
                (cat?.image?.url && cat?.image?.url.includes("assets/img")
                  ? constant?.errImage
                  : cat?.image?.url) ||
                cat?.image?.mob ||
                constant?.errImage
              }
              alt={cat?.name || ""}
              width={1000}
              height={1000}
              className="w-full h-full object-fit rounded-tl-2xl rounded-br-3xl "
            />
          </div>
          {/* <div className="absolute top-0 left-0 w-full rounded-tl-2xl rounded-br-2xl flex justify-between  text-white">
        <div className="relative">
        <Image src={discountBg} alt="" className=""/>
      <div className="absolute bg-red-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit flex gap-1 text-sm">
        <p>15%</p><p>OFF</p></div></div>
        <div>icon</div>
        </div> */}
          {/* <div className="relative w-full h-[45px]"><Image src={btnBg} alt=""  width={1000}
            height={1000}
            className="w-full h-full object-fit"/><h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">Add to Cart</h2>
            </div> */}
        </div>
        <div className="  text-center w-full  font-bold  md:mb-1">
          <h2 className="text-xs sm:text-sm md:text-base">{heading}</h2>
        </div>
        {/* <div className="flex    w-full text-base font-semibold mb-1 ">
        <h2 className="">Calcium Magnesium Zinc Vitamin D3 & B 12 Tablets</h2>
      </div> */}
        {/* <div className="flex gap-2 items-center overflow-hidden  w-full mb-1.5 ">
        <h2 className="text-primary">	&#10027;&#10027;&#10027;&#10027;&#10027; </h2>
        <p className="text-[#ADADAD] text-sm">(10)</p>
      </div> */}
        {/* <div className="flex gap-3 items-center"><h3 className=" text-lg font-semibold">265 AED</h3><h6 className="text-[#ADADAD] line-through text-sm font-medium">4354.78 AED</h6></div> */}
        {/* <div className="text-center">
        <Link href={`/category-product/${slug}`}>
          <button className="border-[1px] border-[black]  text-black  mb-5 mt-1 py-2 px-10">
            Start Shopping
          </button>
        </Link>
      </div> */}
      </div>
    </Link>
    // <div className="border-black border-[1px] ml-2 h-fit  p-[12px] bg-red-50 rounded-md flex">
    //   <div className="w-full">
    //     <div className="h-[50%] my-[10px] flex justify-center items-center">
    //       <Image
    //         src={image?.image?.url}
    //         alt=""
    //         width={100}
    //         height={100}
    //         className="flex-1 max-h-[450px] h-full object-fill rounded-lg"
    //       />
    //     </div>
    //     <h1 className="text-[#253D4E] text-xl  font-semibold my-[5px]">
    //       {heading}
    //     </h1>

    //     <div className="text-sm text-black  lg:text-xl  border-2 border-black py-2 lg:py-4 rounded-md w-full text-center">
    //       Start Shopping
    //     </div>
    //   </div>
    // </div>
  );
};

export default CategoryCard;
