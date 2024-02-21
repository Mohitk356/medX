"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import overlayimg from "../../../images/deal-bg_1 1.svg";
import {
  fetchHomeSections,
  fetchSectionData,
} from "../../../utils/databaseService";
import ProductListCard from "../productListCard/ProductListCard";
import Modal from "../../Modal/modal";
import { CircularProgress } from "@mui/material";
import { useState } from "react";

const ProductList = ({ section, myKey, isHome = true }) => {
  const { data: homeData } = useQuery({
    queryKey: ["homeSections"],
    queryFn: fetchHomeSections,
  });
  const { data: sectionData } = useQuery({
    queryKey: ["sections", section?.widgetID],
    queryFn: () => fetchSectionData(section?.widgetID),
  });

  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const carouselSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: true,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1242,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1515,
        settings: {
          slidesToShow: 5.3,
          slidesToScroll: 5.3,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 3.5,
          infinite: false,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 833,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 3.5,
          initialSlide: 1,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2.5,
          initialSlide: 1,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1.5,
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  return (
    <>
      {homeData &&
        sectionData &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID)[0]
          ?.arr?.length !== 0 && (
          <div
            className="px-body py-8 md:py-10 lg:py-[5.5rem] flex flex-col gap-4 lg:gap-8 relative"
            style={{
              backgroundColor:
                sectionData?.style?.widgetStyle?.backgroundColor || "#E64040",
            }}
          >
            <Modal isOpen={isRemoving} setOpen={setIsRemoving}>
              <div className="flex flex-col gap-2 justify-center items-center">
                <CircularProgress className="!text-white"></CircularProgress>
                <p className="text-white font-medium text-lg">
                  Removing from wishlist.
                </p>
              </div>
            </Modal>
            <Modal isOpen={isAdding} setOpen={setIsAdding}>
              <div className="flex flex-col gap-2 justify-center items-center">
                <CircularProgress className="!text-white"></CircularProgress>
                <p className="text-white font-medium text-lg">
                  Adding to wishlist.
                </p>
              </div>
            </Modal>
            <div className="absolute top-0 left-0  w-full h-full ">
              <Image
                src={overlayimg}
                alt="loading"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 lg:items-center justify-between mb-2 lg:mb-6">
              {section?.sectionName && (
                <div className="flex flex-col justify-center ">
                  <h3 className="text-[#fff]  md:text-4xl text-2xl lg:text-4xl font-semibold">
                    {section?.sectionName}
                  </h3>
                  {/* <h3 className="text-[#FDDF40] text-lg lg:text-2xl font-semibold">
                    {section?.sectionName}
                  </h3> */}
                </div>
              )}

              {/* <div className="rounded-full shadow-xl bg-white flex w-fit items-center gap-4 px-8 py-4">
                <div>
                 <FlatIcon className="flaticon-clock text-xl text-white" />
                </div>
                <p className="text-lg font-medium">Ends In : 05hr 30min</p>
              </div> */}
            </div>

            <div className="w-full  only-carousel  ">
              <Slider {...carouselSettings}>
                {homeData &&
                  homeData?.data?.filter(
                    (val: any) => val?.id === section?.widgetID
                  ) &&
                  homeData?.data?.filter(
                    (val) => val?.id === section?.widgetID
                  ) &&
                  homeData?.data
                    ?.filter((val: any) => val?.id === section?.widgetID)[0]
                    ?.arr?.map((product: any, idx: any) => (
                      <div key={idx} className="px-2 w-full">
                        <ProductListCard
                          product={product?.data || product}
                          prodId={product?.id}
                          setIsAdding={setIsAdding}
                          setIsRemoving={setIsRemoving}
                        />
                      </div>
                    ))}
              </Slider>
            </div>
          </div>
        )}
    </>
  );
};

export default ProductList;
