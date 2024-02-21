"use client";
import { Skeleton, useMediaQuery } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import FilterSection from "../../../../../../../../../components/categoryProduct/filterSections";
import ProductCard from "../../../../../../../../../components/categoryProduct/productCard";
import { constant } from "../../../../../../../../../utils/constants";
import { fetchCategoryProducts } from "../../../../../../../../../utils/databaseService";
import useDebounce from "../../../../../../../../../utils/useDebounce";
import { getFilteredProducts } from "../../../../../../../../../utils/utilities";

const SubSubCategoryProductComponent = ({ params }) => {
  const matches = useMediaQuery("(min-width:1024px)");
  const [filters, setFiters] = useState(constant.filters);
  const [minMax, setMinMax] = useState(null);
  const [products, setProducts] = useState(null);
  const debouncedSearch = useDebounce(filters, 500);
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { data: subCategoryProducts, isLoading } = useQuery({
    queryKey: [
      "shop",
      "category",
      params?.slug,
      params?.subCategorySlug,
      params?.subSubCategorySlug,
    ],
    queryFn: () => {
      return fetchCategoryProducts({
        slug: params?.slug,
        subCatSlug: params?.subCategorySlug,
        subSubCatSlug: params?.subSubCategorySlug,
      });
    },
    keepPreviousData: true,
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
      <div className="w-full flex flex-col lg:flex-row gap-4 ">
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
            <div className="w-full flex justify-center items-center py-20 lg:py-32">
              <h2 className="font-semibold text-xl">No Products Found</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubSubCategoryProductComponent;

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
