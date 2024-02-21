"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { constant } from "../../utils/constants";
import { checkIfPriceDiscounted, paymentMethods } from "../../utils/utilities";
import { useAppSelector } from "../../redux/hooks";

const ReviewTab = ({
  addressToDeliver,
  selectedPaymentMethod,
  paymentSummary,
  placeOrder,
}) => {
  const [isClient, setIsClient] = useState(false);
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col mt-1 w-full mb-12">
      <h6 className="font-medium  text-lg ">
        Please review your order details.
      </h6>
      <div className="w-full flex flex-col gap-4">
        <div className="border border-gray-400  rounded-br-[20px]  mt-10 flex flex-col gap-4">
          {paymentSummary &&
            paymentSummary?.products?.map((product, idx) => {
              return (
                <div className="flex px-4 py-4 gap-8" key={idx}>
                  <div className="w-[auto]">
                    <Image
                      src={product?.img || constant.errImage}
                      alt={product?.name || ""}
                      width={1000}
                      height={1000}
                      className=" object-contain aspect-square border-2 border-gray-300 w-[155px] h-[155px]"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <h3 className="font-semibold text-black text-base w-[383px] h-12">
                      {product?.name}
                    </h3>
                    <h3 className="font-semibold text-black text-opacity-75 text-sm h-12">
                      Quantity: {product?.quantity}
                    </h3>
                    <h3 className="font-bold  text-red-500 text-xl">
                      {checkIfPriceDiscounted({
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
                      )}

                      {isClient && (
                        <>
                          {currency}{" "}
                          {(
                            parseFloat(product?.price.toString()) * currRate
                          ).toFixed(2)}
                        </>
                      )}
                    </h3>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="border border-gray-400 h-[230px]  rounded-br-[20px]  flex flex-col px-4 py-4 gap-8">
          <h4 className="font-bold text-black text-xl ">Billing Details</h4>
          <div className="flex flex-col gap-4">
            <p className="text-neutral-600 text-sm font-medium">
              {" "}
              <span className="font-semibold text-black">Name: </span>{" "}
              {addressToDeliver?.name}
            </p>
            <p className="text-neutral-600 text-sm font-medium">
              {" "}
              <span className="font-semibold text-black">Address: </span>{" "}
              {addressToDeliver?.address}
            </p>
            <p className="text-neutral-600 text-sm font-semibold">
              {" "}
              <span className="font-semibold text-black">Phone: </span>{" "}
              {addressToDeliver?.phoneNo}
            </p>
          </div>
        </div>
        <div className="border border-gray-400  rounded-br-[20px] flex flex-col px-4 py-4 gap-4">
          <h4 className="font-bold text-black text-xl">Payment Method</h4>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <div className="w-7 h-7">
                <Image
                  src={require("../../images/cod.png")}
                  alt="cod"
                  width={1000}
                  height={1000}
                  className="object-contain"
                />
              </div>
              <p className="text-black text-lg font-semibold">
                {
                  paymentMethods.filter(
                    (method: any) => method.value === selectedPaymentMethod
                  )[0]?.name
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex items-center justify-end mt-4 gap-2">
        <button
          className="px-10 border border-black hover:bg-white hover:text-black rounded-full py-2 bg-primary text-white"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </div> */}
    </div>
  );
};

export default ReviewTab;
