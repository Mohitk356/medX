"use client";
import React from "react";
import { fetchHomeSections } from "../../../utils/databaseService";
import { useQuery } from "@tanstack/react-query";
import ServiceCard from "../serviceCard/ServiceCard";

const Services = ({ section, myKey, isHome = true }) => {
  const { data: homeData } = useQuery({
    queryKey: ["homeSections"],
    queryFn: fetchHomeSections,
  });

  return (
    <>
      {homeData &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val) => val?.id === section?.widgetID).length >
          0 &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID)[0]
          ?.arr?.length !== 0 && (
          <div className="px-body" key={myKey}>
            {section?.sectionName && (
              <div className="mx-auto w-auto flex justify-center mb-2">
                <h3 className="mx-auto text-lg lg:text-3xl font-semibold">
                  {section?.sectionName}
                </h3>
              </div>
            )}
            {/* <div className=" flex flex-wrap justify-center items-center relative lg:mt-5"> */}
            <div className=" grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 relative lg:mt-5 place-items-center gap-3">
              {homeData &&
                homeData?.data?.filter(
                  (val: any) => val?.id === section?.widgetID
                ) &&
                homeData?.data?.filter(
                  (val) => val?.id === section?.widgetID
                ) &&
                homeData?.data
                  ?.filter((val: any) => val?.id === section?.widgetID)[0]
                  ?.arr?.map((service: any, idx: any) => {
                    return (
                      <div key={idx}>
                        <ServiceCard service={service} />
                      </div>
                    );
                  })}
            </div>
          </div>
        )}
    </>
  );
};

export default Services;
