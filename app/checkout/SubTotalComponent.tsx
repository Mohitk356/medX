"use client";
import { CircularProgress, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { getUserData, getWalletInfo } from "../../utils/databaseService";

const SubtotalComponent = ({
  paymentSummary,
  isPaymentSummaryLoading,
  userAddress,
  overLayLoading,
  isCashbackUsed,
  setIsCashbackUsed,
  cashbackUsed,
  isCouponApplied,
  appliedCouponAmount,
  addressToDeliver,
}) => {
  const { data: walletInfo } = useQuery({
    queryKey: ["walletInfo"],
    queryFn: () => getWalletInfo(),
    keepPreviousData: true,
  });
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(null),
    keepPreviousData: true,
  });

  const [isClient, setIsClient] = useState(false);
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getCondition() {
    if (addressToDeliver?.country || addressToDeliver?.state) return true;
    return false;
  }

  return (
    <>
      {!paymentSummary || isPaymentSummaryLoading ? (
        <div className="px-3">
          <Skeleton animation="wave" height={60} className="!mb-2" />
          <Skeleton variant="rounded" animation="wave" height={200} />
        </div>
      ) : (
        <div className=" flex flex-col gap-3  rounded-md bg-[#f9f8f8] border border-[#e8e8e8]   py-3 relative">
          {overLayLoading && (
            <div className="z-50 absolute flex justify-center items-center top-0 left-0 rounded-br-[20px] bg-opacity-40 w-full h-full bg-black">
              <CircularProgress className="!text-primary" />
            </div>
          )}
          <div className="flex justify-between gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-5  items-center">
            <p className=" text-sm md:text-base">Subtotal</p>
            <p className=" text-right text-black text-sm md:text-base  ">
              {isClient && (
                <>
                  {(paymentSummary?.totalMrp * currRate)?.toFixed(2)} {currency}{" "}
                  <span className=" text-[10px] md:text-xs">(incl. tax)</span>
                </>
              )}
              {/* {isClient &&
          (paymentSummary?.totalMrp * currRate)?.toFixed(2)} */}
            </p>
          </div>
          {paymentSummary?.discountOnMrp !== 0 && (
            <div className="flex justify-between gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-5  items-center">
              <p className=" text-sm md:text-base">Discount</p>
              <p className=" text-right text-black text-sm md:text-base  ">
                {isClient && (
                  <>
                    -{(paymentSummary?.discountOnMrp * currRate)?.toFixed(2)}{" "}
                    {currency}{" "}
                    <span className=" text-[10px] md:text-xs">(incl. tax)</span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* user wallet conditions */}
          {/* {userData?.wallet?.cashback !== 0 && walletInfo?.active && (
            <>
              <div className="flex flex-col gap-2">
                <div className="w-full flex justify-between sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-5">
                  <p>
                    Cashback available: &nbsp;
                    {(userData?.wallet?.cashback * currRate).toFixed(2)}{" "}
                    {currency}
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      disabled={
                        walletInfo?.minOrderAmnt > paymentSummary?.totalPayable
                      }
                      type="checkbox"
                      name=""
                      id=""
                      onChange={(e) => setIsCashbackUsed(e.target.checked)}
                      value={isCashbackUsed}
                    />
                    <p>Use Cashback</p>
                  </div>
                </div>
                {walletInfo?.minOrderAmnt > paymentSummary?.totalPayable && (
                  <p className=" px-3 sm:px-4 md:px-5 text-xs text-red-500">
                    NOTE : Minimum order amount should be{" "}
                    {(walletInfo?.minOrderAmnt * currRate).toFixed(2)}{" "}
                    {currency} to use cashback
                  </p>
                )}
              </div>
            </>
          )} */}

          <hr className="w-full text-[#e8e8e8]"></hr>
          {/* {paymentSummary?.discountOnMrp !== 0 && ( */}
          {isCouponApplied && (
            <div className="flex  justify-between gap-1 md:gap-2 px-3 sm:px-4 md:px-5">
              <p className="text-sm md:text-base">Coupon Discount</p>
              <p className="text-sm md:text-base text-green-600">
                - {currency}{" "}
                {(appliedCouponAmount?.discount * currRate).toFixed(2)}
              </p>
            </div>
          )}
          <div className="flex-col flex justify-between gap-1 md:gap-2 px-3 sm:px-4 md:px-5">
            <p className="text-sm md:text-base">Shipping</p>
            <p className="font-semibold text-xs sm:text-sm md:text-base">
              <span className="text-primary">Note:</span> Please add/select city
              for shipping calculation.
            </p>
            <p className=" text-xs sm:text-sm md:text-base ">
              Enter your address to view shipping options.
            </p>
          </div>

          {/* {addressToDeliver?.country !== "" ||
            (addressToDeliver?.state !== "" && ( */}

          {getCondition() && (
            <div className="flex justify-between px-3 sm:px-4 md:px-5 relative pb-1 md:pb-2">
              {addressToDeliver?.country !== "United Arab Emirates" &&
                !overLayLoading && (
                  <div className="absolute top-full left-0 w-full px-3 sm:px-4 md:px-5  ">
                    <div className="bg-[#464646]  flex justify-center  py-1 px-1 md:px-2 rounded-sm">
                      <p className="font-semibold text-white text-[10px] sm:text-xs md:text-sm">
                        You are eligible for free Delivery ,for Orders above{" "}
                        {currency}
                        {(1000 * currRate).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              <div className=" font-semibold  flex items-center gap-2">
                <div className="bg-white shadow-lg h-3 w-3 md:h-4 md:w-4 rounded-full flex justify-center items-center">
                  <span className=" bg-primary  h-1 w-1 md:h-1.5 md:w-1.5 rounded-full  "></span>
                </div>
                {/* <div className="absolute left-full bottom-0 clip-triangle w-1 h-1 p-1"></div> */}
                <p className="font-semibold text-xs sm:text-sm md:text-base">
                  {paymentSummary?.delivery?.deliveryCost === 0
                    ? "Free Shipping"
                    : "Shipping Fee"}
                </p>
              </div>

              <p className=" text-right text-black text-xs sm:text-sm md:text-base ">
                {isClient && (
                  <>
                    {paymentSummary?.delivery?.deliveryCost === 0
                      ? "Free"
                      : (
                          paymentSummary?.delivery?.deliveryCost * currRate
                        )?.toFixed(2)}{" "}
                    {paymentSummary?.delivery?.deliveryCost !== 0 && currency}
                  </>
                )}
              </p>
            </div>
          )}
          {isCashbackUsed && (
            <div
              className={`flex justify-between items-center sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-5 ${
                addressToDeliver?.country !== "United Arab Emirates" &&
                !overLayLoading &&
                "mt-5"
              }`}
            >
              <p className="font-semibold">Cashback used:</p>
              <p>
                {(cashbackUsed * currRate).toFixed(2)} {currency}
              </p>
            </div>
          )}

          <hr className="w-full text-[#e8e8e8] mt-3"></hr>
          <div className="flex justify-between   pt-1 pb-1 sm:pb-2 md:pb-3 px-3 sm:px-4 md:px-5">
            <p className="font-semibold text-base sm:text-lg md:text-xl">
              Total
            </p>
            <div className="flex flex-col items-end w-[60%] ">
              <p className=" font-semibold   text-base sm:text-lg md:text-xl">
                {isClient && isCashbackUsed
                  ? (
                      (paymentSummary?.totalPayable - cashbackUsed) *
                      currRate
                    ).toFixed(2)
                  : (paymentSummary?.totalPayable * currRate)?.toFixed(2)}{" "}
                {isClient && currency}{" "}
                {/* {(paymentSummary?.totalPayable * currRate)?.toFixed(2)} */}
              </p>

              <p className="text-[10px] sm:text-xs md:text-sm line-clamp-2 text-end">
                (includes {(paymentSummary?.totalGst * currRate).toFixed(2)} VAT
                estimated for {userAddress?.country})
              </p>

              {/* {paymentSummary?.totalGst !== 0 && (
          <p className="text-sm line-clamp-2">
            (includes {paymentSummary?.totalGst} {currency} VAT
            estimated for {userAddress?.country})
          </p>
        )} */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubtotalComponent;
