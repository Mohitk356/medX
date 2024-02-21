"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  fetchBrandProducts,
  fetchCategoryProducts,
} from "../../utils/databaseService";
import FilterSection from "./filterSections";
import ProductCard from "./productCard";
import { Skeleton, useMediaQuery } from "@mui/material";
import { constant } from "../../utils/constants";
import { getFilteredProducts } from "../../utils/utilities";
import Loader from "../Loader/Loader";

const CategoryProductComponent = ({ params }) => {
  const matches = useMediaQuery("(min-width:1024px)");
  const [filters, setFiters] = useState(constant.filters);
  const [minMax, setMinMax] = useState(null);
  const [products, setProducts] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const {
    data: categoryProducts,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["shop", "category", params?.slug],
    queryFn: () => fetchBrandProducts({ slug: params?.slug }),
  });

  useEffect(() => {
    if (!products) {
      setProducts(categoryProducts?.products);
    }
    if (categoryProducts) {
      setMinMax(categoryProducts?.minMax);
      if (!filters.price) {
        setFiters({ ...filters, price: categoryProducts?.minMax });
      }
    }
  }, [categoryProducts]);

  if (isLoading) {
    return (
      <div className="flex flex-col px-body gap-2 mt-2 pb-4  h-full ">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col px-body gap-2 mt-2 pb-4  h-full ">
      <div className="w-full flex flex-col lg:flex-row gap-2 ">
        {minMax && filters?.price ? (
          <FilterSection
            filters={filters}
            setFiters={setFiters}
            minMax={minMax}
            setMinMax={setMinMax}
          />
        ) : isLoading ? (
          <div className="w-full flex-[0.2] flex lg:hidden gap-4 bg-red-300">
            {isClient && (
              <Skeleton variant="rounded" animation="wave" height={600} />
            )}
          </div>
        ) : (
          <></>
        )}
        <hr />
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
                        products: categoryProducts?.products,
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
          {categoryProducts?.products?.length === 0 ? (
            <div className="w-full flex justify-center items-center py-20 lg:py-32">
              <h2 className="font-semibold text-xl">No Products Found</h2>
            </div>
          ) : (
            <div className="w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 grid gap-y-6 gap-x-6  mb-10">
              {categoryProducts &&
                getFilteredProducts({
                  filters: filters,
                  products: categoryProducts?.products,
                })?.map((product: any) => {
                  return <ProductCard product={product} key={product?.id} />;
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProductComponent;
