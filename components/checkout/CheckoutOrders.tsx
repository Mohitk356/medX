"use client";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { constant } from "../../utils/constants";

const CheckoutOrders = ({ paymentSummary, addressToDeliver }) => {
  const [isClient, setIsClient] = useState(false);
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );
  console.log("CHECKING", addressToDeliver?.country, paymentSummary?.products);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col  w-full max-h-[400px] overflow-y-auto">
      {/* {paymentSummary &&
            paymentSummary?.products?.map((product, idx) => {
              return ( */}
      {!paymentSummary && (
        <>
          <div className="">
            <Skeleton animation="wave" height={200} className="" />
          </div>
        </>
      )}

      {paymentSummary &&
        paymentSummary?.products?.map((product) => {
          return (
            <div className="flex items-center px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 gap-4 sm:gap-6 md:gap-8">
              <div className="w-[auto]">
                <Image
                  src={
                    product?.img &&
                    product?.img?.toString()?.includes("assets/img")
                      ? constant?.errImage
                      : product?.img?.url || constant.errImage
                  }
                  alt={product?.name || ""}
                  width={1000}
                  height={1000}
                  className=" object-contain aspect-square border-2 border-gray-300 w-[50px] h-[50px]"
                />
              </div>

              <div className=" flex flex-col md:flex-row w-full justify-between gap-2">
                <div className="flex-1 flex flex-col md:gap-1 w-full md:w-[60%] ">
                  <h3 className="font-semibold text-black text-xs md:text-sm line-clamp-3">
                    {product?.name} <br />
                    <span className="text-sm text-gray-500">
                      {" "}
                      {product?.isPriceList ? product?.pack?.weight : ""}
                    </span>
                    {/* {product?.name} */}
                  </h3>
                  <div className="flex justify-between items-center w-full ">
                    <h3 className="font-semibold text-black text-opacity-75 text-xs md:text-sm ">
                      Quantity: {product?.quantity}
                      {/* {product?.quantity} */}
                    </h3>
                  </div>
                    {product?.restrictedCountries &&
                      product?.restrictedCountries?.includes(
                        addressToDeliver?.country
                      ) && (
                        <p className="font-semibold text-red-600 text-opacity-75 text-xs md:text-sm">
                          Not Deliverable to Selected Country
                        </p>
                      )}
                </div>

                <h3 className="  text-xs md:text-sm w-full md:w-[35%] text-end">
                  {/* {checkIfPriceDiscounted({
                        discountedPrice: product?.price,
                        price: product?.mrpPrice,
                      }) && (
                        <del className="text-gray-400 text-sm ">
                          {currency}{" "}
                          {(
                            parseFloat(product?.mrpPrice.toString()) * currRate
                          ).toFixed(2)}{" "}
                          &nbsp;
                        </del>
                      )} */}

                  {isClient && (
                    <>
                      {/* mrpPrice */}
                      {(
                        (product?.mrpPrice || product?.price) *
                        product?.quantity *
                        currRate
                      )?.toFixed(2)}{" "}
                      {currency}{" "}
                      <span className=" text-[10px] md:text-xs">
                        (incl.tax)
                      </span>
                      {/* {(
                            parseFloat(product?.price.toString()) * currRate
                          ).toFixed(2)} */}
                    </>
                  )}
                </h3>
              </div>
            </div>
          );
        })}

      {/* );
            })} */}
    </div>
  );
};

export default CheckoutOrders;
