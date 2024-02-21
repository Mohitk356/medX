"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FC } from "react";
import { TiLocation } from "react-icons/ti";
import Link from "next/link";
import FlatIcon from "../flatIcon/flatIcon";
import overlay from "../../images/overlay.svg";
import moment from "moment";

const Singlepostitem = ({ post, id }) => {
  const [hoveredPost, setHoveredPost] = useState("");

  if (!post) {
    return null;
  }

  return (
    <Link
      href={`/health-information-center/${encodeURIComponent(post?.slug)}`}
      className="h-full"
    >
      <div
        className="flex flex-col items-center shadow-lg border-2 h-full"
        onMouseEnter={() => {
          setHoveredPost(id);
        }}
        onMouseLeave={() => {
          setHoveredPost("");
        }}
      >
        <div className="relative  w-full h-auto flex items-center justify-center  overflow-hidden">
          <Image
            src={post?.imgUrl}
            alt={post?.title || ""}
            width={1000}
            height={1000}
            className={`w-full h-full object-contain 
            ${hoveredPost === id ? "lg:hover-effect" : "lg:hover-effect-out"}
            
                `}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />

          {/* <div className= {`absolute -top-1/3 left-0 w-full h-auto  ${hoveredPost === id
                ? "visible"
                : "invisible"}`}
                >
              <Image
                src={overlay}
                alt=""
                width={1000}
                className="w-full h-auto object-cover opacity-60"
                height={1000}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </div> */}

          <div
            className={`absolute w-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  rounded-3xl  ${
              hoveredPost === id ? "visible " : "invisible"
            }`}
          >
            <FlatIcon className="flaticon-arrow-right transition-all ease-in animate-bounce text-white text-2xl sm:text-3xl  md:text-4xl" />
          </div>
        </div>

        <div className="flex flex-col text-left gap-2 sm:gap-3 md:gap-4 p-4 w-full sm:p-6 md:p-8 ">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold ">
            {post?.title}
          </h2>

          <p className="font-medium text-[10px] sm:text-xs md:text-sm text-[#ada5a0]  ">
            {moment(new Date(post?.createdAt?.seconds * 1000)).format(
              "DD MMM, yyyy"
            )}
          </p>

          <p
            className="text-xs sm:text-sm md:text-base  line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post?.description }}
          ></p>
        </div>
      </div>
    </Link>
  );
};

export default Singlepostitem;
