"use client";
import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchHomeSections,
  fetchMuscleShowPage,
} from "../../../utils/databaseService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { bannerLink } from "../../../utils/bannerLink/bannerLinking";
import Link from "next/link";

const MuscleShowBannerSlider = ({ section, myKey, isHome = true }) => {
  const router = useRouter();

  const { data: muscleShow } = useQuery({
    queryKey: ["muscle-show-2023"],
    queryFn: fetchMuscleShowPage,
  });

  const slider = useRef<any>(null);

  var settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      {muscleShow &&
        muscleShow?.data?.filter((val: any) => val?.id === section?.widgetID) &&
        muscleShow?.data?.filter((val) => val?.id === section?.widgetID) &&
        muscleShow?.data?.filter((val) => val?.id === section?.widgetID)
          .length > 0 &&
        muscleShow?.data?.filter((val: any) => val?.id === section?.widgetID)[0]
          ?.arr?.length !== 0 && (
          <div className="w-full">
            <Slider
              ref={slider}
              {...settings}
              nextArrow={<></>}
              prevArrow={<></>}
              autoplay={true}
              dots={false}
              className="relative"
            >
              {muscleShow &&
                muscleShow?.data?.filter(
                  (val: any) => val?.id === section?.widgetID
                ) &&
                muscleShow?.data?.filter(
                  (val) => val?.id === section?.widgetID
                ) &&
                muscleShow?.data
                  ?.filter((val: any) => val?.id === section?.widgetID)[0]
                  ?.arr?.map((banner: any, idx: any) => (
                    <Link
                      target="_blank"
                      href={bannerLink(banner) || ""}
                      onClick={(e) => {
                        if (
                          !bannerLink(banner) ||
                          bannerLink(banner)?.includes("undefined")
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="h-auto w-full"
                      key={idx + 100}
                    >
                      <Image
                        src={banner?.image?.org}
                        alt={banner?.image?.caption || "image"}
                        width={1000}
                        height={100}
                        layout="responsive"
                        className="object-fill w-full h-full"
                      />
                    </Link>
                  ))}
            </Slider>
          </div>
        )}
    </>
    // </div>
  );
};

export default MuscleShowBannerSlider;
