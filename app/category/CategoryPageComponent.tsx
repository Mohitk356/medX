"use client";
import React from "react";
import { fetchCategories } from "../../utils/databaseService";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader/Loader";
import Link from "next/link";
import Image from "next/image";
import { constant } from "../../utils/constants";

const CategoryPageComponent = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });
  return (
    <div className="px-body ">
      {isLoading && (
        // <div className="bg-red-200 w-full">
        // {" "}
        <Loader />
        // </div>
      )}
      {!isLoading && !categories && (
        <div>
          <h2>Categories Not Available</h2>
        </div>
      )}
      {/* <NextBreadcrumbs /> */}

      {categories && categories.length > 0 && (
        <div className="w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 grid gap-y-6 gap-x-6  my-5">
          {categories?.map((category, idx) => {
            const item = category?.category;
            return (
              <Link
                href={
                  item?.isSubcategories
                    ? `/category/${item?.slug?.name}`
                    : `/shop/category/${item?.slug?.name}`
                }
                key={idx}
              >
                <div className=" text-center border-[1px] border-[#D2D2D2]  rounded-br-3xl ">
                  {/* <div><Image src={item.image.url} alt=''/></div> */}
                  <div className="h-[140px] lg:h-[200px]  lg:p-0 px-3   rounded-br-3xl  ">
                    <Image
                      src={
                        item?.image?.url &&
                        item?.image?.url?.includes("assets/img")
                          ? constant.errImage
                          : item?.image?.url
                      }
                      alt={item?.name || ""}
                      width={1000}
                      height={1000}
                      className="w-full h-full object-fit  rounded-br-3xl "
                    />
                  </div>
                  <p className="my-2 line-clamp-1 text-center text-sm sm:text-base font-semibold ">
                    {item.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryPageComponent;
