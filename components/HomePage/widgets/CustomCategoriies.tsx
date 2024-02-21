import Image from "next/image";
import React from "react";
import { constant } from "../../../utils/constants";
import Link from "next/link";

const CustomCategoriies = ({ myKey, section }) => {
  const type = section?.widgetType;
  return (
    <div className="px-body" key={myKey}>
      <div className="w-full flex lg:bg-[#FFE7E7] gap-6 ">
        <div className="w-[20%] bg-primary rounded-tr-[60px] hidden lg:block">
          <Image
            src={require(type === "disease"
              ? "../../../images/femaleDoc.png"
              : "../../../images/maleDoc.png")}
            alt="female doc"
            // layout="responsive"
            width={1000}
            height={1000}
            className="w-[70%]  mx-auto h-full"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-5 ">
          <h2 className=" text-[#252B42]  md:text-3xl text-2xl font-bold">
            {section?.sectionName}
          </h2>

          <div className="grid  grid-cols-2 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6  py-4">
            {(type === "disease" ? constant?.diseases : constant.nutrition).map(
              (item, idx) => {
                return (
                  <Link href={`/shop-by/${item.keyword}`} key={item?.keyword}>
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <div className="w-[80px] sm:w-[90px] md:w-[100px]">
                        <Image
                          src={require(`../../../images/${item.image}`)}
                          alt={item.name}
                          width={1000}
                          height={1000}
                          className="w-full h-full"
                        />
                      </div>
                      <p className="font-semibold text-center">{item.name}</p>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCategoriies;
