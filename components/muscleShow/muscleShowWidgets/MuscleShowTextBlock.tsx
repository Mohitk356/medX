"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchMuscleShowPage } from "../../../utils/databaseService";

const MuscleShowTextBlock = ({ section, myKey, isHome = true }) => {
  const { data: homeData } = useQuery({
    queryKey: ["muscle-show-2023"],
    queryFn: fetchMuscleShowPage,
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
          <div className=" flex flex-col gap-4 -mt-6 ">
            {section?.sectionName && (
              <div className="mx-auto w-auto flex justify-center mb-2">
                <h3 className="mx-auto text-lg lg:text-3xl font-semibold">
                  {section?.sectionName}  
                </h3>
              </div>
            )}
            <div className=" bg-muscleShowGradiantTextBlock py-10">
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

export default MuscleShowTextBlock;
