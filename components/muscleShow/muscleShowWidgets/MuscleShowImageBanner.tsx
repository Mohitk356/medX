import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  fetchHomeSections,
  fetchMuscleShowPage,
} from "../../../utils/databaseService";
import Image from "next/image";
import { constant } from "../../../utils/constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { bannerLink } from "../../../utils/bannerLink/bannerLinking";
import { useRouter } from "next/navigation";
import Link from "next/link";
const MuscleShowImageBanner = ({ section, myKey = ``, isHome = true }) => {
  const { data: homeData } = useQuery({
    queryKey: ["muscle-show-2023"],
    queryFn: fetchMuscleShowPage,
  });

  const router = useRouter();
  const [hoveredProduct, setHoveredProduct] = useState(false);

  const imagesArr =
    homeData &&
    homeData?.data?.filter((val: any) => val?.id === section?.widgetID) &&
    homeData?.data?.filter((val) => val?.id === section?.widgetID) &&
    homeData?.data?.filter((val) => val?.id === section?.widgetID)[0]?.arr;

  if (!imagesArr) return <></>;

  var newImagesArr;
  if (imagesArr?.length > 3) {
    newImagesArr = imagesArr.slice(0, 3);
  } else {
    newImagesArr = imagesArr;
  }

  if (imagesArr.length === 0) return <div className="hidden"></div>;

  return (
    <div className="px-body w-full  " key={myKey}>
      <div
        className={` ${
          newImagesArr.length === 1 ? "flex-col" : "flex-col lg:flex-row"
        }  flex  items-center gap-3`}
      >
        {newImagesArr &&
          newImagesArr.length > 0 &&
          newImagesArr.map((imageData, index) => (
            <Link
              target="_blank"
              href={bannerLink(imageData)||""}
              onClick={(e) => {
                if (
                  !bannerLink(imageData) ||
                  bannerLink(imageData)?.includes("undefined")
                ) {
                  e.preventDefault();
                }
              }}
              key={imageData.image.org || imageData.image.url}
              className={` ${
                newImagesArr.length === 1
                  ? "md:w-full"
                  : ` md:w-1/${newImagesArr.length}`
              } w-full rounded-br-2xl flex  items-center`}
            >
              <Image
                src={
                  imageData.image.org ||
                  imageData.image.url ||
                  imageData?.image.mob
                }
                alt="banner"
                width={1000}
                height={1000}
                layout="responsive"
                className="flex-1 w-full h-[16.25rem] object-fit "
              />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default MuscleShowImageBanner;
