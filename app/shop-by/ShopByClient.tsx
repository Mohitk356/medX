"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchSimilarProductsForCart } from "../../config/typesense";
import ProductCard from "../../components/categoryProduct/productCard";
import logo from "../../images/logo.png";
import Image from "next/image";

const ShopByClient = ({ params }) => {
  const {
    data: shopByData,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["shop-by", params?.slug],
    queryFn: () =>
      fetchSimilarProductsForCart({ searchKeywords: [params?.slug] }),
    keepPreviousData: false,
  });

  return (
    <div className=" px-body  py-10">
      <div className="w-full  flex flex-col  ">
        {/* <div className="flex py-2 border-b-2 border-primary w-fit">
          <h2 className="text-2xl font-semibold">
            Shop By '{}'
          </h2>
        </div> */}
        {isFetching || isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            {/* <div className="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div> */}
            <div className=" flex-col gap-2 w-[40%] md:w-[20%] h-auto">
              <Image
                src={logo}
                alt="loading"
                className=" breathing-animation"
                width={200}
                height={200}
                layout="responsive"
              />
              {/* <p className="text-center">Loading...</p> */}
            </div>
          </div>
        ) : shopByData && shopByData?.length !== 0 ? (
          <div className="w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 grid gap-y-6 gap-x-6  mb-10">
            {shopByData &&
              shopByData?.map((product, idx) => {
                return <ProductCard product={product} idx={idx} />;
              })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[50vh]">
            <h2 className="text-2xl font-semibold">No results found.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopByClient;
