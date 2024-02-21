"use client";
import React from "react";
import { TiLocation } from "react-icons/ti";
import farmerlogoimage from "../../images/logobackground.svg";
import { useQuery } from "@tanstack/react-query";
import { fetchSinglePost } from "../../utils/databaseService";
import Image from "next/image";
import ImageB from "../../images/farmerlist2.svg";
import overlay from "../../images/overlay.svg";
import sports from "../../images/sports.jpg";
import moment from "moment";

const DUMMY_DATA = {
  image: sports,
  heading: "ACACIA Organic Farm",
  date: "Octtober, 18 2023",
  para1:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  para2:
    "  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
};

const PostSection = ({ params }: any) => {
  const { data: singlePost } = useQuery({
    queryKey: ["articles", params?.postdetails],
    queryFn: () => fetchSinglePost({ postdetails: params?.postdetails }),
  });

  //   return (
  //     <div className="px-[3.5%] py-[3.5%]">

  //       <div className="flex flex-col items-center gap-3 sm:gap-5 md:gap-7 ">
  //         <div className="bg-white w-full sm:w-[70%] md:w-[60%] h-auto flex items-center justify-center ">
  //           <Image
  //             src={singlePost?.image}
  //             alt=""
  //             width={1000}
  //             height={1000}
  //             className="w-full h-full object-contain"
  //             style={{
  //               maxWidth: "100%",
  //               height: "auto",
  //             }}
  //           />
  //         </div>

  //         <div className="flex flex-col text-left gap-2 sm:gap-3 md:gap-4  " >
  //           <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold ">
  //             {singlePost?.heading}
  //           </h2>

  //             <p className="font-medium text-xs sm:text-sm md:text-base text-[#ada5a0]  ">
  //               {singlePost?.date}
  //             </p>

  //            <div dangerouslySetInnerHTML={{__html:singlePost?.desc}}  ></div>
  //         </div>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="px-[3.5%] py-[3.5%]">
      <div className="flex flex-col items-center gap-3 sm:gap-5 md:gap-7 ">
        <div className="bg-white w-full sm:w-[70%] md:w-[60%] h-auto flex items-center justify-center ">
          <Image
            src={singlePost?.imgUrl}
            alt={singlePost?.title || ""}
            width={1000}
            height={1000}
            className="w-full h-full object-contain"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>

        <div className="flex flex-col text-left gap-2 sm:gap-3 md:gap-4  ">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold ">
            {singlePost?.title}
          </h2>

          <p className="font-medium text-xs sm:text-sm md:text-base text-[#ada5a0]  ">
            {moment(new Date(singlePost?.createdAt?.seconds * 1000)).format(
              "MMMM, DD yyyy"
            )}
          </p>

          <div className="custom-article">
            <div
              dangerouslySetInnerHTML={{ __html: singlePost?.description }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSection;
