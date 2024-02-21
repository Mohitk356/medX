"use client";
import React, { useEffect, useState } from "react";
import { fetchCategoryProducts } from "../../utils/databaseService";
import { useQuery } from "@tanstack/react-query";
import { Image } from "react-bootstrap";
import Link from "next/link";
import Loader from "../Loader/Loader";
import { Skeleton, useMediaQuery } from "@mui/material";
import ProductCard from "../categoryProduct/productCard";
import FilterSection from "../categoryProduct/filterSections";
import { constant } from "../../utils/constants";
import { getFilteredProducts } from "../../utils/utilities";

const SubCategoryProductComponent = ({ params }) => {
  const matches = useMediaQuery("(min-width:1024px)");

  const [filters, setFiters] = useState(constant.filters);
  const [minMax, setMinMax] = useState(null);
  const [products, setProducts] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { data: subCategoryProducts, isLoading } = useQuery({
    queryKey: ["shop", "category", params?.slug, params?.subCategorySlug],
    queryFn: () =>
      fetchCategoryProducts({
        slug: params?.slug,
        subCatSlug: params?.subCategorySlug,
      }),
    cacheTime: 60 * 60 * 3,
  });

  useEffect(() => {
    if (!products) {
      setProducts(subCategoryProducts?.products);
    }
    if (subCategoryProducts) {
      setMinMax(subCategoryProducts?.minMax);
      if (!filters.price) {
        setFiters({ ...filters, price: subCategoryProducts?.minMax });
      }
    }
  }, [subCategoryProducts]);

  return (
    <div className="flex flex-col px-body gap-2 mt-6  h-full ">
      <div className="w-full flex  flex-col lg:flex-row gap-2 ">
        {minMax && filters?.price ? (
          <FilterSection
            filters={filters}
            setFiters={setFiters}
            minMax={minMax}
            setMinMax={setMinMax}
          />
        ) : isLoading ? (
          <div className="w-full flex-[0.2] flex lg:hidden gap-4  z-0">
            {isClient && (
              <Skeleton variant="rounded" animation="wave" height={600} />
            )}
          </div>
        ) : (
          <></>
        )}
        <hr className="hidden lg:block" />
        <div className="w-full flex-1">
          {matches && (
            <>
              <div className="flex justify-between mb-2 items-center">
                <h4 className="font-bold text-lg">
                  Results:{" "}
                  <span className="font-medium text-base text-gray-400">
                    (
                    {
                      getFilteredProducts({
                        filters: filters,
                        products: subCategoryProducts?.products,
                      })?.length
                    }
                    ) Items
                  </span>{" "}
                </h4>

                <div className="flex gap-2 items-center">
                  <h4 className="font-bold text-lg">Sorted By:</h4>
                  <div className="border border-black py-2 px-3">
                    <select name="" id="" className="font-bold">
                      <option value="" className="font-bold">
                        Best Selling
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <hr className="mb-2" />
            </>
          )}
          {subCategoryProducts?.products &&
          subCategoryProducts?.products?.length !== 0 ? (
            <div className="w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 grid gap-y-6 gap-x-6  mb-10">
              {subCategoryProducts &&
                getFilteredProducts({
                  filters: filters,
                  products: subCategoryProducts?.products,
                })?.map((product: any) => {
                  return (
                    <ProductCard
                      product={product}
                      key={product?.id}
                      hideHover={true}
                    />
                  );
                })}
            </div>
          ) : (
            <div className="font-semibold text-xl flex flex-col justify-center items-center min-h-[40vh]">
              No Products Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryProductComponent;

// {subCategoryProducts &&
//   categoryProducts.length > 0 &&
//   categoryProducts.map((item: any, idx: number) => {
//      <Link href={`/categry/${product?.slug?.name}`}>
//     return (
//       <Link
//         href={`/category/${params?.slug}/sub-category-product/${item?.slug?.name} `}
//         key={idx}
//       >
//         <div className=" text-center border-[1px] border-[#D2D2D2]  rounded-br-3xl ">
//           {/* <div><Image src={item.image.url} alt=''/></div> */}
//           <div className="h-[100px] lg:h-[200px]    rounded-br-3xl  ">
//             {/* <Image
//   src={item?.image?.url}
//   alt=""
//   width={1000}
//   height={1000}
//   className="w-full h-full object-fit  rounded-br-3xl "
// /> */}
//           </div>
//           <p className="my-2 text-ellipsis overflow-hidden ... truncate text-center   text-base font-bold ">
//             {item.name}
//           </p>
//         </div>
//       </Link>
//     );
//   })}
