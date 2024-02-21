"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHomeSections } from "../../../utils/databaseService";

const TextBlock = ({ section, myKey, isHome = true }) => {
  const { data: homeData } = useQuery({
    queryKey: ["homeSections"],
    queryFn: fetchHomeSections,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {homeData &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID)[0]
          ?.docSnap && (
          <div className="px-body flex flex-col gap-4">
            {section?.sectionName && (
              <div className="mx-auto w-auto flex justify-center mb-2">
                <h3 className="mx-auto text-lg lg:text-3xl font-semibold">
                  {section?.sectionName}
                </h3>
              </div>
            )}
            <div className="px-body">
              <div
                className=""
                dangerouslySetInnerHTML={{
                  __html: homeData?.data?.filter(
                    (val: any) => val?.id === section?.widgetID
                  )[0]?.docSnap?.description,
                }}
              ></div>
            </div>
          </div>
        )}
    </>
  );
};

export default TextBlock;
