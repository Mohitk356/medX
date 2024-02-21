"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchStorLocations } from "../../utils/databaseService";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import Link from "next/link";
import FlatIcon from "../../components/flatIcon/flatIcon";
import logo from "../../images/logo.png";
import Image from "next/image";

const StoreLocationsClient = ({ cookie }) => {
  console.log({ cookie });

  const { data: storeLocations, isLoading } = useQuery({
    queryKey: ["storeLocations"],
    queryFn: () => fetchStorLocations(),
  });
  return (
    <div className="px-body py-6">
      <h1 className="text-3xl font-semibold">Find us at a location near you</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
        {!storeLocations && isLoading ? (
          <div className="w-full min-h-[30vh]  flex items-center justify-center ">
            {/* <div className="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div> */}
            <div className=" flex-col gap-2 w-[40%] md:w-[20%] h-auto">
              <Image
                src={logo}
                alt="loading"
                className=" breathing-animation"
                width={200}
                height={200}
                layout="responsive"
              />
              {/* <p className="text-center">Loading...</p> */}
            </div>
          </div>
        ) : (
          storeLocations?.map((location: any) => {
            let encodedName = encodeURIComponent(location?.name);
            if (!location?.location?.address) return <></>;
            return (
              <div
                key={location?.name}
                className="flex flex-col gap-3 justify-between border border-[#D6D6D6] hover:border-primary p-4"
              >
                <h3 className="font-semibold text-xl">{location?.name}</h3>

                <div className="flex flex-col gap-3 ">
                  <div className="flex items-start gap-3">
                    <div className="w-[10%] flex justify-center items-center">
                      <FaLocationDot className="text-primary text-2xl mt-1" />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-lg">Location</p>
                      <p className="line-clamp-2 text-[#222222]">
                        {location?.location?.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-[8%] flex justify-center items-center">
                      <IoIosCall className="text-primary text-3xl mt-1" />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-lg">Contact Us</p>
                      <p className="line-clamp-2 text-[#222222]">
                        {location?.phoneNo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-[8%] flex justify-center items-center">
                      <AiOutlineClockCircle className=" text-primary text-3xl -mt-2" />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-lg">Opening Hours</p>
                      <p className="line-clamp-2 text-[#222222]">
                        {location?.hours}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex mt-2 gap-4">
                  <Link
                    href={`https://wa.me/${location?.whatsapp}`}
                    target="_blank"
                  >
                    <button className="bg-primary py-2 px-4 text-white rounded-md flex items-center gap-1">
                      <span>
                        <FlatIcon className={"flaticon-whatsapp-1"} />
                      </span>
                      Whatsapp
                    </button>
                  </Link>
                  {location?.location?.lat && location?.location?.lng && (
                    <Link
                      href={`https://www.google.com/maps?q=${encodedName}&ll=${location?.location?.lat},${location?.location?.lng}`}
                      target="_blank"
                    >
                      <button className="bg-black py-2 px-4 text-white rounded-md flex items-center gap-1">
                        <span>
                          <FaLocationArrow />
                        </span>{" "}
                        Get Location
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StoreLocationsClient;
