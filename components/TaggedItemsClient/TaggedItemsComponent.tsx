"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchTaggedItems } from "../../utils/bannerLink/bannerLinking";
import Loader from "../Loader/Loader";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "../categoryProduct/productCard";

const TaggedItemsComponent = ({ params, searchQuery }) => {
  let ids = JSON.parse(searchQuery.ids);
  let type = searchQuery?.type;

  const { data: taggedItems, isFetching } = useQuery({
    queryKey: ["taggedItems", type],
    queryFn: () => fetchTaggedItems({ type, ids }),
  });

  const renderProducts = () => {
    return (
      <div className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 grid gap-y-6 gap-x-6 mt-6 ">
        {taggedItems?.map((product: any, idx: any) => {
          return <ProductCard product={product} key={product?.id} />;
        })}
      </div>
    );
  };
  const renderCategories = () => {
    return (
      <div className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 grid gap-y-6 gap-x-6 mt-6 ">
        {taggedItems?.map((item, idx) => {
          return (
            <Link
              href={
                item?.isSubcategories
                  ? `/category/${item?.slug?.name}`
                  : `/category-product/${item?.slug?.name}`
              }
              key={idx}
            >
              <div className=" text-center border-[1px] border-[#D2D2D2]  rounded-br-3xl ">
                {/* <div><Image src={item.image.url} alt=''/></div> */}
                <div className="h-[100px] lg:h-[200px]    rounded-br-3xl  ">
                  <Image
                    src={item?.image?.url}
                    alt={item?.name || ""}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-fit  rounded-br-3xl "
                  />
                </div>
                <p className="my-2 text-ellipsis overflow-hidden ... truncate text-center   text-base font-bold ">
                  {item.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex py-6 flex-col w-full px-body">
      <h1 className="text-xl lg:text-2xl font-semibold">Tagged {type}s</h1>
      {isFetching && !taggedItems && taggedItems.length < 0 && <Loader />}

      {!isFetching &&
      taggedItems &&
      taggedItems.length > 0 &&
      type === "Product" ? (
        renderProducts()
      ) : type === "Category" ? (
        renderCategories()
      ) : (
        <></>
      )}
    </div>
  );
};

export default TaggedItemsComponent;
