"use client";
import React, { useState } from "react";
import { fetchHomeSections } from "../../../utils/databaseService";
import { useQuery } from "@tanstack/react-query";
import BrandCard from "../brandCard/BrandCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Brands = ({ section, myKey, isBrand = false, isHome = true }) => {
  const [isHovered, setIsHovered] = useState("");
  const { data: homeData } = useQuery({
    queryKey: ["homeSections"],
    queryFn: fetchHomeSections,
  });

  const carouselSettings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    arrows: false,
    autoplay: true,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1242,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 4.5,
          infinite: false,
          // dots: true,
        },
      },
      {
        breakpoint: 1515,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: false,
          // dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
          // dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 833,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 3.5,
          initialSlide: 1,
          // dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 1,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: false,
          arrows: false,
        },
      },
    ],
  };

  return (
    <>
      {homeData &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val) => val?.id === section?.widgetID)
          .length !== 0 &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID)[0]
          ?.arr?.length !== 0 && (
          <div className="px-body flex flex-col justify-center  pb-12">
            {section?.sectionName && (
              <div className="mb-10 ">
                <h3 className="text-2xl lg:text-4xl font-semibold">
                  {section?.sectionName}
                </h3>
              </div>
            )}
            {/* <div className=" flex flex-wrap justify-center items-center relative lg:mt-5"> */}
            <div className=" w-full ">
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
                    ?.arr?.map((brand: any, idx: any) => {
                      //   ?.filter((val: any) => val?.id === section?.widgetID)[0]
                      //   ?.arr)
                      return (
                        <div
                          key={idx}
                          className="flex-1 mx-2"
                          onMouseEnter={() => {
                            setIsHovered(brand?.id);
                          }}
                          onMouseLeave={() => {
                            setIsHovered("");
                          }}
                        >
                          <BrandCard brand={brand} isHovered={isHovered} />
                        </div>
                      );
                    })}
              </Slider>
            </div>
          </div>
        )}
    </>
  );
};

export default Brands;
