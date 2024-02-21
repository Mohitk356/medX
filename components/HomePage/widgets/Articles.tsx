"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { fetchArticles } from "../../../utils/databaseService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import moment from "moment";
import { Skeleton } from "@mui/material";
import Link from "next/link";

const Articles = ({ myKey, section }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  const slider = useRef<any>(null);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1242,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1515,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2.5,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 833,
        settings: {
          slidesToShow: 2.15,
          slidesToScroll: 2.15,
          initialSlide: 1,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          initialSlide: 1,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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

  return (
    <>
      {isClient && (
        <>
          {isLoading && (
            <div className="flex flex-col gap-2 px-body">
              <Skeleton
                animation="wave"
                height={60}
                className="!mb-2 w-[15%]"
              />
              <Skeleton variant="rounded" animation="wave" height={200} />
            </div>
          )}

          {!isLoading && articles && articles.length > 0 && (
            <div className="px-body" key={myKey || Math.random()}>
              <div className="flex flex-col w-full ">
                {section?.sectionName && (
                  <div className=" w-auto flex justify-start mb-2">
                    <h3 className=" text-[#0C0C0C]  md:text-4xl sm:text-3xl text-2xl font-semibold">
                      {section?.sectionName}
                      {/* Nutrition & Supplements */}
                    </h3>
                  </div>
                )}

                <div className="w-[100%] flex-1 h-auto only-carousel mt-4 ">
                  <Slider
                    ref={slider}
                    {...settings}
                    className=""
                    dotsClass={`slick-dots `}
                    nextArrow={<SampleNextArrow />}
                    prevArrow={<SamplePrevArrow />}
                    draggable={true}
                    autoplay={true}
                  >
                    {articles?.slice(0, 3).map((article: any, idx: any) => {
                      return (
                        <div className="flex-1  h-full" key={idx}>
                          <Link
                            href={`/health-information-center/${encodeURIComponent(
                              article?.slug
                            )}`}
                          >
                            <div className="mx-2  h-full  flex flex-col gap-1 md:gap-2 items-center justify-center lg:items-start border border-primary rounded-br-3xl p-4 sm:p-5 md:p-6">
                              <div className="w-[250px] h-[200px] sm:w-[270px] sm:h-[220px] md:w-[290px] md:h-[240px] lg:w-full lg:h-[260px] ">
                                <Image
                                  src={article?.imgUrl}
                                  alt={article?.title || "article"}
                                  width={1000}
                                  height={1000}
                                  className="w-full h-full object-fill"
                                ></Image>
                              </div>
                              <div className="flex gap-2 w-full items-center justify-center lg:justify-start">
                                <div className="line w-5 h-[2px] bg-primary"></div>
                                <p className="font-semibold md:text-lg sm:text-base text-sm">
                                  {moment(
                                    new Date(article?.createdAt?.seconds * 1000)
                                  ).format("DD MMM, yyyy")}
                                </p>
                                <div className="line w-5 h-[2px] bg-primary"></div>
                              </div>
                              <div className="text-center lg:text-left">
                                <p className="font-semibold md:text-lg sm:text-base text-sm line-clamp-1">
                                  {article.title}
                                </p>
                              </div>
                              <div className="  text-center lg:text-left">
                                <p
                                  className="md:text-lg sm:text-base text-sm line-clamp-3"
                                  dangerouslySetInnerHTML={{
                                    __html: article?.description,
                                  }}
                                ></p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </Slider>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Articles;
