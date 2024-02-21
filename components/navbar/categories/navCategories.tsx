"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import image from "../../images/wdc.webp";
import useMediaQuery from "@mui/material/useMediaQuery";
import OutsideClickHandler from "../../../utils/OutsideClickHandler";
import whiteBg from "../../../images/Rectangle 24031.png";
import fireImg from "../../../images/fi_1685179.svg";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../../utils/databaseService";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import CategoriesBar from "./categoriesBar";

const Categories = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const [tab, setTab] = useState(0);
  const [catquan, setcatquan] = useState(5);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const categorycheck1 = useMediaQuery("(max-width:600px)");
  const categorycheck2 = useMediaQuery("(max-width:655px)");
  const categorycheck3 = useMediaQuery("(max-width:749px)");
  const categorycheck4 = useMediaQuery("(max-width:899px)");
  const hovershow = useMediaQuery("(max-width:975px)");
  useEffect(() => {}, []);

  const handleTabClick = (tabIndex) => {
    if (tab === tabIndex) {
      setTab(0); // Close the categories if the clicked tab is already open
    } else {
      setTab(tabIndex); // Open the clicked tab
    }
  };

  return (
    <div className=" relative  sm:py-1 md:py-1.5 lg:py-2.5  w-[93%] mx-auto ">
      <OutsideClickHandler
        onClick={() => {
          // setTab(0);
        }}
      >
        <div className="   ">
          <div className="w-full mx-auto flex items-center justify-between gap-5">
            <div className="flex items-center xl:gap-10 gap-5">
              <div
                onClick={() => {
                  // handleTabClick(0);
                }}
                onMouseEnter={() => {
                  setTab(0);
                  setHoveredCategory("shopby");
                }}
                onMouseLeave={() => {
                  setHoveredCategory(null);
                  setTab(null);
                }}
                className={`
                     lg:gap-2 gap-1 items-center w-fit relative  border-b-2 border-primary hover:border-white   `}
                // className={`
                //    ${
                //      hoveredCategory === "shopby" && ""
                //    }  lg:gap-2 gap-1 items-center w-fit  border-b-2 border-primary hover:border-white  `}
              >
                <Link href={"/category"}>
                  <h1 className="text-xs md:text-sm text-white font-medium cursor-pointer">
                    Shop by Category
                  </h1>
                </Link>

                {!hovershow ? (
                  <Transition
                    appear={true}
                    show={hoveredCategory !== null && tab === 0}
                  >
                    <Transition.Child
                      className="flex flex-col absolute left-0 pt-5 w-full   z-30  transition duration-300"
                      enter="ease-in-out"
                      enterFrom=" opacity-0"
                      enterTo=" opacity-100"
                      leave="ease-out"
                      leaveFrom=" opacity-100"
                      leaveTo=" opacity-0"
                    >
                      <CategoriesBar
                        type={
                          hoveredCategory === "shopby" ? hoveredCategory : null
                        }
                        categories={categories}
                        hoveredCategory={hoveredCategory}
                        setHoveredCategory={setHoveredCategory}
                      />
                    </Transition.Child>
                  </Transition>
                ) : (
                  ""
                )}
              </div>
              {categories
                ?.slice(
                  0,
                  categorycheck1
                    ? 1
                    : categorycheck2
                    ? 2
                    : categorycheck3
                    ? 3
                    : categorycheck4
                    ? 4
                    : 5
                )
                .map((categoryData, index) => {
                  let category = categoryData?.category;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        // handleTabClick(index + 1);
                      }}
                      onMouseEnter={() => {
                        if (
                          category?.isSubcategories &&
                          categoryData?.subcategories &&
                          categoryData?.subcategories?.length !== 0
                        ) {
                          setTab(index + 1);
                          setHoveredCategory(index);
                        } else {
                          setHoveredCategory(null);
                        }
                      }}
                      onMouseLeave={() => {
                        // setHoveredCategory(null);
                        // setTab(null);
                        // setTab(null);
                        // if (category?.isSubcategories) {
                        //   setHoveredCategory(null);
                        // } else {
                        //   setHoveredCategory(null);
                        // }
                      }}
                      className={`
                     lg:gap-2 gap-1 items-center w-fit   border-b-2 border-primary hover:border-white   `}
                    >
                      <Link
                        href={
                          category?.isSubcategories &&
                          categoryData?.subcategories?.length !== 0
                            ? `/category/${category?.slug?.name}`
                            : `/shop/category/${category?.slug?.name}`
                        }
                        onClick={() => {
                          setHoveredCategory(null);
                        }}
                      >
                        <h1 className="text-xs md:text-[13px] lg:text-sm text-white font-medium cursor-pointer">
                          {category.name}
                        </h1>
                      </Link>
                      {!hovershow ? (
                        <Transition
                          appear={true}
                          show={hoveredCategory !== null && tab === index + 1}
                        >
                          <Transition.Child
                            className="flex flex-col absolute left-0 pt-5    z-30  transition duration-300"
                            enter="ease-in-out"
                            enterFrom=" opacity-0"
                            enterTo=" opacity-100"
                            leave="ease-out"
                            leaveFrom=" opacity-100"
                            leaveTo=" opacity-0"
                          >
                            <OutsideClickHandler
                              onClick={() => {
                                setHoveredCategory(null);
                                setTab(null);
                              }}
                              onMouseLeave={() => {
                                setHoveredCategory(null);
                                setTab(null);
                              }}
                            >
                              <CategoriesBar
                                type={
                                  hoveredCategory === "shopby"
                                    ? hoveredCategory
                                    : null
                                }
                                categories={categories}
                                hoveredCategory={hoveredCategory}
                                setHoveredCategory={setHoveredCategory}
                              />
                            </OutsideClickHandler>
                          </Transition.Child>
                        </Transition>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
            </div>
            {/* <div className="relative   w-[80px]  lg:w-[100px]">
              <Link href={`/shop/category/sale`}>
                <Image
                  src={whiteBg}
                  alt=""
                  className="w-full h-full object-fill"
                  height={1000}
                  width={1000}
                  layout="responsive"
                  // style={{ aspectRatio: "auto", width: "100px", height: "auto" }}
                />
                <div className="absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 w-fit flex items-center lg:gap-2  ">
                  <div className="w-[15px]  lg:w-[25px]  border-black">
                    <Image
                      src={fireImg}
                      alt=""
                      className="w-full h-full object-fill"
                      width={1000}
                      height={1000}
                      // style={{
                      //   aspectRatio: "auto",
                      //   width: "200px",
                      //   height: "auto",
                      // }}
                      // layout="responsive"
                    />
                  </div>

                  <p className="text-primary font-semibold text-sm md:text-base lg:text-lg">
                    SALE
                  </p>
                </div>
              </Link>
            </div> */}
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default Categories;
