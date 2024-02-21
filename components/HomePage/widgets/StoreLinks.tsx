"useclient";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { fetchStoreLinksData } from "../../../utils/databaseService";

const StoreLinks = ({ myKey, section }) => {
  const { data: storeData, isFetching } = useQuery({
    queryKey: ["appData"],
    queryFn: fetchStoreLinksData,
  });

  return (
    <>
      {storeData && (
        <div key={myKey}>
          <div className="flex flex-col lg:flex-row bg-[#F2F7FF] px-body pt-2 md:pt-4 gap-6">
            <div className="hidden lg:flex flex-1 justify-center items-end">
              <div className="">
                <Image
                  width={1000}
                  height={1000}
                  src={require("../../../images/screenShot.png")}
                  alt="phone"
                  layout = 'responsive'
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col flex-1 gap-3 lg:gap-5 justify-center py-6 ">
              <div className="min-w-[140px] w-[35%] sm:w-[20%] lg:w-[37%] lg:max-w-[240px] flex justify-start">
                <Image
                  src={require("../../../images/storeLinkLogo.png")}
                  alt="logo"
                  width={1000}
                  height={1000}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="pl-2 lg:pl-4">
                <h6 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">
                  Your Trusted Pharmacy is <br /> Now Online!
                </h6>
              </div>
              <div className="flex justify-start gap-4 pl-4">
                <Link href={storeData?.appStoreUrl} target="_blank">
                  <button className="flex w-[110px] sm:w-[115px] md:w-[120px] lg:w-full">
                    <Image
                      src={require("../../../images/App Store.png")}
                      width={1000}
                      height={1000}
                      alt="App store"
                      className="w-full h-full"
                    />
                  </button>
                </Link>
                <Link href={storeData?.playstoreUrl} target="_blank">
                  <button className="flex w-[110px] sm:w-[115px] md:w-[120px] lg:w-full">
                    <Image
                      src={require("../../../images/Google Play.png")}
                      width={1000}
                      height={1000}
                      alt="Play store"
                      className="w-full h-full"
                    />
                  </button>
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default StoreLinks;
