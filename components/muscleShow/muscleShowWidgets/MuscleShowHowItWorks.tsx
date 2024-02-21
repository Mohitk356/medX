"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  fetchStoreLinksData,
  getReferralInfo,
  getWalletInfo,
} from "../../../utils/databaseService";
import { useAppSelector } from "../../../redux/hooks";

const MuscleShowHowItWorks = () => {
  const { data: storeData, isFetching } = useQuery({
    queryKey: ["appData"],
    queryFn: fetchStoreLinksData,
  });

  const { data: walletInfo } = useQuery({
    queryKey: ["walletInfo"],
    queryFn: () => getWalletInfo(),
    keepPreviousData: true,
  });
  const { data: referral } = useQuery({
    queryKey: ["referralInfo"],
    queryFn: () => getReferralInfo(),
    keepPreviousData: true,
  });

  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  const subhHeadingStyle = "font-semibold md:text-3xl sm:text-2xl text-xl";
  const textStyle =
    "text-[#999999] font-semibold sm:text-base md:text-lg text-sm";
  return (
    <>
      <div className=" px-body">
        <div>
          <h1 className="font-semibold md:text-5xl sm:text-3xl text-2xl text-center md:mb-20 mb-8">
            How it Works?
          </h1>
        </div>
        <div className="flex flex-col items-center md:gap-5 gap-8">
          <div className="flex sm:flex-row gap-y-4 flex-col md:gap-x-12 gap-x-6  justify-center w-full ">
            <div className=" flex gap-4 xl:w-[30%] md:w-[40%] w-[100%] sm:justify-end justify-center items-center">
              <div className="flex items-end gap-4">
                <div className="flex flex-col justify-end gap-4 pl-4">
                  {/* <Link href={storeData?.appStoreUrl} target="_blank"> */}
                  <Link href={storeData?.appStoreUrl || ""} target="_blank">
                    <button className="flex w-[80px] sm:w-[115px] md:w-[120px] md:h-[44px]  h-[36px] lg:w-[130px]">
                      <Image
                        src={require("../../../images/App Store.png")}
                        width={1000}
                        height={1000}
                        alt="App store"
                        className="w-full h-full"
                      />
                    </button>
                  </Link>

                  {/* </Link> */}
                  {/* <Link href={storeData?.playstoreUrl} target="_blank"> */}
                  <Link href={storeData?.playstoreUrl || ""} target="_blank">
                    <button className="flex w-[80px] sm:w-[115px] md:w-[120px] md:h-[44px]  h-[36px] lg:w-[130px]">
                      <Image
                        src={require("../../../images/Google Play.png")}
                        width={1000}
                        height={1000}
                        alt="Play store"
                        className="w-full h-full"
                      />
                    </button>
                  </Link>
                  {/* </Link> */}
                </div>
                <div className="md:h-[160px] md:w-[150px] w-[100px] h-[120px]">
                  <Image
                    width={1000}
                    height={1000}
                    src={require("../../../images/screenShot.png")}
                    alt="phone"
                    //   layout = 'responsive'
                    className="w-[100%] h-[100%] object-fill"
                  />
                </div>
              </div>
            </div>
            <div className="h-full xl:w-[5%] w-[10%] md:block hidden">
              <div className="w-full h-[100%]  flex justify-center items-center flex-col gap-5">
                <div className="w-[60px] h-[60px]  border border-black rounded-full  flex items-center justify-center">
                  <h1 className="text-3xl font-bold">1</h1>
                </div>
                <div className="w-[1px] h-[200px] bg-black"></div>
              </div>
            </div>
            <div className=" xl:w-[30%] md:w-[40%] w-[100%]">
              <div className="flex flex-col sm:gap-6 gap-3 sm:text-start text-center">
                <div>
                  <h1 className={`${subhHeadingStyle}`}>Download the app</h1>
                </div>
                <div>
                  <p className={`${textStyle}`}>
                    Download the app now from Play Store <br /> and App Store.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* second section start  */}
          <div className="flex  sm:flex-row gap-y-4 flex-col flex-col-reverse md:gap-x-12 gap-x-6  justify-center w-full ">
            <div className="xl:w-[30%] md:w-[40%] w-[100%] ">
              <div className="flex flex-col sm:gap-6 gap-3 sm:text-start text-center">
                <div>
                  <h1 className={`${subhHeadingStyle}`}>
                    Sign up and get <br /> Cashback
                  </h1>
                </div>
                <div>
                  <p className={`${textStyle}`}>
                    Sign up With Your Mobile And get{" "}
                    {walletInfo &&
                      (walletInfo?.newUserWalletAmnt * currRate).toFixed(
                        2
                      )}{" "}
                    <br /> {currency} Cashback in Your Wallet.
                  </p>
                </div>
              </div>
            </div>
            <div className=" h-full xl:w-[5%] w-[10%] md:block hidden">
              <div className="w-full h-[100%]  flex justify-center items-center flex-col gap-4">
                <div className="w-[60px] h-[60px]  border border-black rounded-full  flex items-center justify-center">
                  <h1 className="text-3xl font-bold">2</h1>
                </div>
                <div className="w-[1px] h-[200px] bg-black"></div>
              </div>
            </div>
            <div className="flex  gap-4 xl:w-[30%] md:w-[40%] w-[100%]  sm:justify-start justify-center">
              <div className="flex items-center gap-4 ">
                <div className="md:h-[146px] md:w-[266px] w-[200px] h-[120px]">
                  <Image
                    width={1000}
                    height={1000}
                    src={require("../../../images/Group 34351.svg")}
                    alt="phone"
                    //   layout = 'responsive'
                    className="w-[100%] h-[100%] object-fill"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* second section end  */}
          {/* third section start  */}
          <div className="flex sm:flex-row gap-y-4 flex-col md:gap-x-12 gap-x-6  justify-center w-full ">
            <div className="flex gap-4 xl:w-[30%] md:w-[40%] w-[100%] sm:justify-end justify-center ">
              <div className="flex items-center gap-4 md:h-[220px] ">
                <div className="md:h-[114px] md:w-[250px] w-[180px] h-[90px] ">
                  <Image
                    width={1000}
                    height={1000}
                    src={require("../../../images/Group 34355.svg")}
                    alt="phone"
                    //   layout = 'responsive'
                    className="w-[100%] h-[100%] object-fill"
                  />
                </div>
              </div>
            </div>
            <div className=" h-full xl:w-[5%] w-[10%] md:block hidden">
              <div className=" w-full h-[100%]  flex justify-center items-center flex-col gap-5">
                <div className="w-[60px] h-[60px]  border border-black rounded-full  flex items-center justify-center">
                  <h1 className="text-3xl font-bold">3</h1>
                </div>
                {/* <div className='w-[1px] h-[200px] bg-black'></div> */}
              </div>
            </div>
            <div className="xl:w-[30%] md:w-[40%] w-[100%] ">
              <div className="flex flex-col sm:gap-6 gap-3 sm:text-start text-center">
                <div>
                  <h1 className={`${subhHeadingStyle}`}>
                    Refer Friends, Family
                  </h1>
                </div>
                <div>
                  <p className={`${textStyle}`}>
                    Refer Your Friends or Family to Sign up <br /> and get a {referral&& (referral?.friendCashback * currRate).toFixed(2)} {currency} Bonus.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* third section end  */}
        </div>
      </div>
    </>
  );
};

export default MuscleShowHowItWorks;
