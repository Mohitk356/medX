"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchMuscleShowPage } from "../../../utils/databaseService";
import VendorCard from "../../HomePage/vendorCard/VendorCard";

const MuscleShowVendors = ({
  section,
  myKey,
  isBrand = false,
  isHome = true,
}) => {
  const { data: homeData } = useQuery({
    queryKey: ["muscle-show-2023"],
    queryFn: fetchMuscleShowPage,
  });

  return (
    <>
      {homeData &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val) => val?.id === section?.widgetID) &&
        homeData?.data?.filter((val: any) => val?.id === section?.widgetID)[0]
          ?.arr?.length !== 0 && (
          <div className="px-body ">
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
                  ?.arr?.map((vendor: any, idx: any) => {
                    return (
                      <div key={idx}>
                        <VendorCard vendor={vendor} />
                      </div>
                    );
                  })}
            </div>
          </div>
        )}
    </>
  );
};

export default MuscleShowVendors;
