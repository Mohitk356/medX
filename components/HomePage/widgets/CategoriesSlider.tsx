"use client";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { fetchHomeSections } from "../../../utils/databaseService";
import CategoryCard from "../../categoryCard/CategoryCard";

const CategoriesSlider = ({ section, myKey, isHome = true }) => {
  const { data: homeData } = useQuery({
    queryKey: ["homeSections"],
    queryFn: fetchHomeSections,
  });

  const slider = useRef<any>(null);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1242,
        settings: {
          slidesToShow: 5.75,
          slidesToScroll: 5,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1515,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5.5,
          slidesToScroll: 5,
          infinite: true,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 833,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          initialSlide: 1,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 4,
          initialSlide: 1,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4.15,
          slidesToScroll: 4,
          dots: true,
          arrows: false,
        },
      },
    ],
  };
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return <div className={`${className}`} onClick={onClick} />;
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return <div className={`${className}`} onClick={onClick} />;
  }

  const arrowButtonClass =
    "absolute top-0 bottom-0 my-auto bg-black w-10 h-10 block text-white cursor-pointer z-20";

  return (
    // <div key={myKey}>
    <>
      {homeData &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val) => val?.id === section?.widgetID)
          .length !== 0 &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID)[0]
          ?.arr?.length !== 0 && (
          <div className=" px-body mt-4 md:mt-0" key={myKey}>
            {section?.sectionName && (
              <div className=" flex  mb-2">
                <h1 className="text-[#333333]  md:text-4xl text-2xl font-bold ">
                  {section?.sectionName}
                </h1>
              </div>
            )}
            <div className="flex justify-center items-center relative lg:mt-5">
              <div className="back ">
                <div className="w-[92vw] h-auto">
                  <Slider
                    ref={slider}
                    {...settings}
                    className=""
                    dotsClass={`slick-dots`}
                    arrows={true}
                    nextArrow={<SampleNextArrow/>}
                    prevArrow={<SamplePrevArrow/>}
                    draggable={true}
                  >
                    {homeData &&
                      homeData?.data?.filter(
                        (val: any) => val?.id === section?.widgetID
                      ) &&
                      homeData?.data?.filter(
                        (val) => val?.id === section?.widgetID
                      ) &&
                      homeData?.data
                        ?.filter((val: any) => val?.id === section?.widgetID)[0]
                        ?.arr?.map((cat: any, idx: any) => {
                          // console.log();

                          return (
                            <div className="" key={idx}>
                              <CategoryCard
                                cat={cat}
                                heading={cat?.name}
                                slug={cat?.slug?.name}
                              />
                            </div>
                          );
                        })}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
    // </div>
  );
};

export default CategoriesSlider;

// <div className="">
// <button
//   className={`${arrowButtonClass} left-0 lg:-left-4 `}
//   onClick={() => slider.current?.slickPrev()}
// >
//   L
// </button>
// </div>

// <div className="">
// <button
//   className={`${arrowButtonClass} right-0 lg:-right-4 `}
//   onClick={() => slider.current?.slickNext()}
// >
//   R
// </button>
// </div>
