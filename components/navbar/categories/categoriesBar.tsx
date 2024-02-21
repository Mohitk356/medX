"use client";
import Link from "next/link";
import React, { FC, useState } from "react";
import FlatIcon from "../../flatIcon/flatIcon";
import Image from "next/image";
interface Props {
  type: string;
  categories?: any;
  subCategories?: any;
  hoveredCategory?: any;
  setHoveredCategory?: any;
}
const CategoriesBar: FC<Props> = ({
  type,
  categories = null,
  hoveredCategory = 0,
  setHoveredCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(0);

  const style =
    "flex items-center justify-between gap-2 font-bold lg:text-base text-sm lg:px-[20px] px-[10px] py-2 cursor-pointer";
  const style2 = "font-semibold lg:text-base text-sm lg:px-[20px] px-[10px]";

  if (hoveredCategory === null) return <></>;

  if (hoveredCategory === "shopby") {
    return SubSubCategoryRender(
      categories,
      setSelectedCategory,
      setHoveredCategory,
      selectedCategory
    );
  }

  return (
    <div className="absolute left-0 w-[90vw] bg-white shadow-lg rounded-b-lg min-w-[100%]  mx-auto   z-30">
      <div className="flex justify-between">
        <div className="flex-1 bg-white py-4 rounded-bl-lg px-2 max-h-[400px] flex flex-col flex-wrap">
          {categories[hoveredCategory]?.subcategories?.map((subCat) => {
            return (
              // <div className="flex flex-col flex-wrap max-h-[400px] mt-2">
              <>
                <Link
                  href={
                    subCat?.isSubcategories
                      ? `/category/${categories[hoveredCategory]?.category?.slug?.name}/${subCat?.slug?.name}`
                      : `/shop/category/${categories[hoveredCategory]?.category?.slug?.name}/${subCat?.slug?.name}`
                  }
                  className={`${subCat?.isSubcategories ? "" : "mb-1"}`}
                  key={subCat?.id}
                  onClick={() => setHoveredCategory(null)}
                >
                  <div
                    className={` w-auto flex items-center justify-between px-2 gap-6   hover:bg-white`}
                  >
                    <h2 className="whitespace-nowrap font-semibold text-base hover:text-primary">
                      {subCat?.name}
                    </h2>
                  </div>
                </Link>
                {subCat?.isSubcategories &&
                  subCat?.subSubCategories &&
                  subCat?.subSubCategories.length > 0 &&
                  subCat?.subSubCategories.map((subSubCat, index) => {
                    return (
                      <Link
                        href={`/shop/category/${categories[hoveredCategory]?.category?.slug?.name}/${subCat?.slug?.name}/${subSubCat?.slug?.name}`}
                        key={subSubCat?.id}
                        className={`${
                          index + 1 === subCat?.subSubCategories?.length &&
                          "mb-2"
                        }`}
                        onClick={() => setHoveredCategory(null)}
                      >
                        <div
                          className={`mt-1 w-auto flex items-center justify-between px-2   hover:bg-white`}
                        >
                          <h2 className="whitespace-nowrap text-sm hover:text-primary">
                            {subSubCat?.name}
                          </h2>
                        </div>
                      </Link>
                    );
                  })}
              </>
              // </div>
            );
          })}
        </div>
        {categories[hoveredCategory]?.category?.banner &&
          categories[hoveredCategory]?.category?.banner?.url && (
            <div className="w-[25%] rounded-br-lg flex flex-col items-center justify-center pr-4">
              <div className="max-h-[400px]">
                <Image
                  src={categories[hoveredCategory]?.category?.banner?.url}
                  alt={categories[hoveredCategory]?.category?.name}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
      </div>
      {/* <div className="flex flex-col justify-between gap-2 absolute left-0 w-auto  min-w-[100%] rounded-b-lg bg-white shadow-lg">
        <div className=" w-full py-[0px] flex flex-col flex-wrap bg-[#ececec] rounded-b-lg">
          {categories[hoveredCategory]?.subcategories &&
            categories[hoveredCategory]?.subcategories.map(
              (subCat: any, index: any) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelectedSubCategory(index);
                    }}
                    onMouseLeave={() => setSelectedSubCategory(null)}
                    key={subCat?.id}
                    className="w-full p-2 hover:bg-white relative"
                  >
                    <Link
                      href={
                        subCat?.isSubcategories
                          ? `/category/${categories[hoveredCategory]?.category?.slug?.name}/${subCat?.slug?.name}`
                          : `/shop/category/${categories[hoveredCategory]?.category?.slug?.name}/${subCat?.slug?.name}`
                      }
                      onClick={() => setHoveredCategory(null)}
                    >
                      <p className="lg:text-base font-medium text-xs whitespace-nowrap flex items-center justify-between gap-6">
                        {subCat?.name}
                        {subCat?.isSubcategories && (
                          <span>
                            <FlatIcon className={"flaticon-arrow-right"} />
                          </span>
                        )}
                      </p>
                    </Link>
                    <Transition
                      appear={true}
                      show={
                        selectedSubCategory !== null &&
                        selectedSubCategory === index &&
                        subCat?.isSubcategories
                      }
                    >
                      <Transition.Child
                        className="flex flex-col absolute left-full top-0 w-full bg-white rounded-b-lg  transition duration-100"
                        enter="ease-in-out"
                        enterFrom=" opacity-0"
                        enterTo=" opacity-100"
                        leave="ease-out"
                        leaveFrom=" opacity-100"
                        leaveTo=" opacity-0"
                      >
                        {categories[hoveredCategory]?.subcategories[
                          selectedSubCategory
                        ]?.subSubCategories && (
                          <div className=" w-full py-[0px] flex flex-col rounded-b-lg bg-[#ececec]">
                            {categories[hoveredCategory]?.subcategories[
                              selectedSubCategory
                            ]?.subSubCategories?.map((subSubCat: any) => {
                              return (
                                <div className="relative" key={subSubCat?.id}>
                                  <Link
                                    href={`/shop/category/${categories[hoveredCategory]?.category?.slug?.name}/${subCat?.slug?.name}/${subSubCat?.slug?.name}`}
                                    key={subSubCat?.id}
                                    onClick={() => setHoveredCategory(null)}
                                  >
                                    <div
                                      className={` w-auto flex items-center justify-between px-2 gap-6 py-2  hover:bg-white`}
                                    >
                                      <h2 className="whitespace-nowrap">
                                        {subSubCat?.name}
                                      </h2>
                                      {subSubCat?.isSubcategories && (
                                        <span>
                                          <FlatIcon
                                            className={"flaticon-arrow-right"}
                                          />
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </Transition.Child>
                    </Transition>
                  </div>
                );
              }
            )}
        </div>
      </div> */}
    </div>
  );
};
export default CategoriesBar;

function SubSubCategoryRender(
  categories: any,
  setSelectedCategory: React.Dispatch<any>,
  setHoveredCategory: any,
  selectedCategory: any
): React.ReactNode {
  return (
    <div className="absolute left-0  w-[90vw]   min-w-[100%]  z-30">
      <div className="flex  gap-2 absolute left-0 w-auto  min-w-[100%]  bg-white shadow-lg rounded-b-lg">
        <div className=" w-fit py-[0px] flex flex-col  bg-[#ececec] rounded-b-lg">
          {categories &&
            categories?.map((categoryData, idx) => {
              let category = categoryData?.category;
              return (
                <div
                  key={category?.id}
                  className="relative"
                  onMouseEnter={() => {
                    setSelectedCategory(idx);
                  }}
                  // onMouseLeave={() => setSelectedCategory(null)}
                >
                  <Link
                    href={
                      category?.isSubcategories
                        ? `/category/${category?.slug?.name}`
                        : `/shop/category/${category?.slug?.name}`
                    }
                    key={idx}
                    onClick={() => setHoveredCategory(null)}
                  >
                    <div
                      className={`relative w-auto flex items-center justify-between px-2 gap-6 py-2  hover:bg-white`}
                    >
                      <h2 className="whitespace-nowrap">{category?.name}</h2>
                      {category?.isSubcategories && (
                        <span>
                          <FlatIcon className={"flaticon-arrow-right"} />
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
        <div className="flex flex-col  flex-wrap max-h-[400px] px-2 py-2">
          {categories[selectedCategory]?.subcategories?.map((subCat) => {
            return (
              <div className="flex flex-col flex-wrap max-h-[400px] mt-2">
                <Link
                  href={
                    subCat?.isSubcategories
                      ? `/category/${categories[selectedCategory]?.category?.slug?.name}/${subCat?.slug?.name}`
                      : `/shop/category/${categories[selectedCategory]?.category?.slug?.name}/${subCat?.slug?.name}`
                  }
                  key={subCat?.id}
                  onClick={() => setHoveredCategory(null)}
                >
                  <div
                    className={` w-auto flex items-center justify-between px-2 gap-6   hover:bg-white`}
                  >
                    <h2 className="whitespace-nowrap font-semibold text-base hover:text-primary">
                      {subCat?.name}
                    </h2>
                  </div>
                </Link>
                {subCat?.isSubcategories &&
                  subCat?.subSubCategories &&
                  subCat?.subSubCategories.length > 0 &&
                  subCat?.subSubCategories.map((subSubCat) => {
                    return (
                      <Link
                        href={`/shop/category/${categories[selectedCategory]?.category?.slug?.name}/${subCat?.slug?.name}/${subSubCat?.slug?.name}`}
                        key={subSubCat?.id}
                        onClick={() => setHoveredCategory(null)}
                      >
                        <div
                          className={`mt-1 w-auto flex items-center justify-between px-2   hover:bg-white`}
                        >
                          <h2 className="whitespace-nowrap text-sm hover:text-primary">
                            {subSubCat?.name}
                          </h2>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
