"use client";
import React, { useRef, useState } from "react";
import { fetchHomeSections } from "../../../utils/databaseService";
import { useQuery } from "@tanstack/react-query";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ProductCarouselCard from "../productCarouselCard/ProductCarouselCard";
import Modal from "../../Modal/modal";
import { CircularProgress } from "@mui/material";

const ProductCarousel = ({
  section = null,
  myKey = null,
  isHome = true,
  customProducts = null,
  customSectionName = null,
  isDotsVisible = true,
  slug = null,
}) => {
  const { data: homeData } = useQuery({
    queryKey: ["homeSections"],
    queryFn: fetchHomeSections,
  });
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  // const [page, setPage] = useState(0);
  // const [totalPage, setTotalPage] = useState(100);

  const slider = useRef<any>(null);
  const settings = {
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
          slidesToShow: 6,
          slidesToScroll: 6,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 833,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 3,
          initialSlide: 1,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
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
          dots: isDotsVisible,
          arrows: false,
        },
      },
    ],
  };

  function getProduct(product) {
    return product?.data || product;
  }

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return <div className={`${className}`} onClick={onClick} />;
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return <div className={`${className}`} onClick={onClick} />;
  }

  if (customProducts) {
    if (customProducts.length === 0) return <></>;
    return (
      <>
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
        <div className="">
          {customSectionName && (
            <div className=" w-auto flex justify-start  px-body  ">
              <h3 className=" text-[#252B42]  md:text-4xl text-2xl font-semibold">
                {customSectionName}
                {/* Nutrition & Supplements */}
              </h3>
            </div>
          )}
          <div className="  justify-center items-center relative ">
            {/* {page != 0 && (
                <div className="hidden lg:flex">
                  <button
                    className={`${arrowButtonClass} left-0 lg:left-4 `}
                    onClick={() => slider.current?.slickPrev()}
                  >
                    L
                  </button>
                </div>
              )} */}
            <div className="back  ">
              <div className="w-[100%] lg:px-body h-auto only-carousel">
                <Slider
                  ref={slider}
                  {...settings}
                  className="my-3 md:my-5"
                  dotsClass={`slick-dots `}
                  nextArrow={<SampleNextArrow />}
                  prevArrow={<SamplePrevArrow />}
                  draggable={true}
                >
                  {customProducts?.map((product: any, idx: any) => {
                    const productData = getProduct(product);
                    return (
                      <div className="flex-1  " key={idx}>
                        <ProductCarouselCard
                          product={productData}
                          prodId={product?.id}
                          setIsAdding={setIsAdding}
                          slug={slug}
                          setIsRemoving={setIsRemoving}
                        />
                      </div>
                    );
                  })}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
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
          <p className="text-white font-medium text-lg">Adding to wishlist.</p>
        </div>
      </Modal>
      {homeData &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val) => val?.id === section?.widgetID)?.length >
          0 &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID)[0]
          ?.arr?.length !== 0 && (
          <div className="">
            {section?.sectionName && (
              <div className=" w-auto flex justify-start md:mb-2 px-body ">
                <h3 className=" text-[#252B42]  md:text-4xl text-2xl font-semibold">
                  {section?.sectionName}
                  {/* Nutrition & Supplements */}
                </h3>
              </div>
            )}
            <div className="  justify-center items-center relative lg:mt-5">
              {/* {page != 0 && (
                <div className="hidden lg:flex">
                  <button
                    className={`${arrowButtonClass} left-0 lg:left-4 `}
                    onClick={() => slider.current?.slickPrev()}
                  >
                    L
                  </button>
                </div>
              )} */}
              <div className="back  ">
                <div className="w-[100%] lg:px-body h-auto only-carousel">
                  <Slider
                    ref={slider}
                    {...settings}
                    className=""
                    dotsClass={`slick-dots `}
                    nextArrow={<SampleNextArrow />}
                    prevArrow={<SamplePrevArrow />}
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
                        ?.arr?.map((product: any, idx: any) => {
                          const productData = getProduct(product);
                          return (
                            <div className="flex-1  " key={idx}>
                              <ProductCarouselCard
                                product={productData}
                                prodId={product?.id}
                                setIsAdding={setIsAdding}
                                setIsRemoving={setIsRemoving}
                              />
                            </div>
                          );
                        })}
                  </Slider>
                </div>
              </div>
              {/* {page < totalPage-1 && (
                <div className=" hidden lg:flex">
                  <button
                    className={`${arrowButtonClass} right-0 lg:right-4 `}
                    onClick={() => slider.current?.slickNext()}
                  >
                    R
                  </button>
                </div>
              )} */}
            </div>
          </div>
        )}
    </>
  );
};

export default ProductCarousel;
