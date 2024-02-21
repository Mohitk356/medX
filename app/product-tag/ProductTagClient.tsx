"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { handleTypesenseSearch } from "../../config/typesense";
import ProductCard from "../../components/categoryProduct/productCard";
import Image from "next/image";
import logo from "../../images/logo.png";

const ProductTagClient = ({ slug }) => {
  const {
    data: searchData,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["product-tag", slug],
    queryFn: () => handleTypesenseSearch(slug),
    keepPreviousData: true,
  });

  return (
    <div className="px-body py-10">
      <div className="w-full flex flex-col">
        {slug && (
          <div className="flex py-2 border-b-2 border-primary w-fit">
            <h2 className=" text-xl lg:text-2xl font-semibold">
              Results for '{slug}' ({(searchData && searchData?.length) || 0}{" "}
              Results)
            </h2>
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
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
          </div>
        ) : searchData && searchData?.length !== 0 ? (
          <div className="mt-4 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-3">
            {searchData &&
              searchData?.map((product, idx) => {
                return <ProductCard product={product} idx={idx} />;
              })}
          </div>
        ) : (
          slug && (
            <div className="flex justify-center items-center h-[50vh]">
              <h2 className="text-2xl font-semibold">No results found.</h2>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductTagClient;
