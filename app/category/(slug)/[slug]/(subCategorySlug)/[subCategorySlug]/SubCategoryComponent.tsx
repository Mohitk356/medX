"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Image } from "react-bootstrap";
import Link from "next/link";
import Loader from "../../../../../../components/Loader/Loader";
import { fetchSubCategories } from "../../../../../../utils/databaseService";
import NextBreadcrumbs from "../../../../../../components/breadCrumb/NextBreadCrumb";

const SubCategoryComponent = ({ params }) => {
  const { data: subCategories, isLoading } = useQuery({
    queryKey: ["subCategory", params?.slug, params?.subCategorySlug],
    queryFn: () =>
      fetchSubCategories({
        slug: params?.slug,
        subCategorySlug: params?.subCategorySlug,
      }),
  });

  return (
    <div className="px-body">
      {isLoading && (
        // <div className="bg-red-200 w-full">
        // {" "}
        <Loader />
        // </div>
      )}
      {!isLoading && !subCategories && (
        <div>
          <h2>Subcategories Not Available</h2>
        </div>
      )}

      {/* <NextBreadcrumbs /> */}

      {subCategories && subCategories.length > 0 && (
        <div className="w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 grid gap-y-6 gap-x-6  my-5">
          {subCategories?.map((item, idx) => {
            return (
              <Link
                href={
                  item?.isSubcategories
                    ? `/category/${params?.slug}/${params?.subCategorySlug}/${item?.slug?.name}`
                    : `/shop/category/${params?.slug}/${params?.subCategorySlug}/${item?.slug?.name}`
                }
                key={idx}
              >
                <div className=" text-center border-[1px] border-[#D2D2D2]  rounded-br-3xl ">
                  {/* <div><Image src={item.image.url} alt=''/></div> */}
                  <div className="h-[140px] lg:h-[200px]  lg:p-0 px-3   rounded-br-3xl  ">
                    <Image
                      src={item?.image?.url}
                      alt={item?.name||""}
                      width={1000}
                      height={1000}
                      className="w-full h-full object-fit  rounded-br-3xl "
                    />
                  </div>
                  <p className="my-2 line-clamp-1 text-center   text-base font-semibold ">
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

export default SubCategoryComponent;
