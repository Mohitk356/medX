"use client";
import React, { useEffect, useState } from "react";
import StripeCheckout from "./StripeCheckout";
import PlaceOrder from "./PlaceOrder";

const Paymentmethods = ({
  addressToDeliver,
  placeOrder,
  paymentSummary,
  setUserNote,
  userNote,
  checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry,
  isTermsAgreed,
  setIsTermsAgreed,
  loading,
  updatePaymentMethod,
  setLoading,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod]: any =
    useState("online");

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <div className=" flex flex-col gap-3  rounded-md  border border-[#e8e8e8]   py-3 relative">
        {addressToDeliver?.state === "Dubai" && (
          <div className="flex flex-col justify-between px-5 gap-2 ">
            <div className="  flex items-center gap-2">
              <div
                onClick={() => {
                  setSelectedPaymentMethod("cash");
                  updatePaymentMethod("cash");
                }}
                className="cursor-pointer bg-white shadow-lg h-4 w-4 rounded-full flex justify-center items-center"
              >
                <span
                  className={` ${
                    selectedPaymentMethod === "cash"
                      ? "bg-primary"
                      : "bg-gray-300"
                  } h-1.5 w-1.5 rounded-full `}
                ></span>
              </div>

              <p className=" font-semibold text-black text-base ">
                Cash On Delivery
              </p>
            </div>
            <p className="text-sm ">Pay with cash upon delivery.</p>
            {selectedPaymentMethod === "cash" && (
              <PlaceOrder
                checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry={
                  checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry
                }
                userNote={userNote}
                setUserNote={setUserNote}
                loading={loading}
                handleSubmit={placeOrder}
                isTermsAgreed={isTermsAgreed}
                setIsTermsAgreed={setIsTermsAgreed}
              />
            )}
          </div>
        )}
        <div className="flex flex-col justify-between px-5 gap-2 ">
          <div className="  flex flex-col items-start gap-2 ">
            <div className="flex gap-2 items-center">
              <div
                onClick={() => {
                  updatePaymentMethod("online");

                  setSelectedPaymentMethod("online");
                }}
                className="cursor-pointer bg-white shadow-lg h-4 w-4 rounded-full flex justify-center items-center"
              >
                <span
                  className={` ${
                    selectedPaymentMethod === "online"
                      ? "bg-primary"
                      : "bg-gray-300"
                  } h-1.5 w-1.5 rounded-full `}
                ></span>
              </div>

              <p className=" font-semibold text-black text-base ">Pay Online</p>
            </div>
            <div className="w-full">
              {!!paymentSummary &&
                selectedPaymentMethod &&
                selectedPaymentMethod === "online" && (
                  <StripeCheckout
                    checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry={
                      checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry
                    }
                    paymentSummary={paymentSummary}
                    setLoading={setLoading}
                    userNote={userNote}
                    setUserNote={setUserNote}
                    loading={loading}
                    setIsTermsAgreed={setIsTermsAgreed}
                    isTermsAgreed={isTermsAgreed}
                    placeOrder={placeOrder}
                    openStripe={
                      selectedPaymentMethod &&
                      selectedPaymentMethod === "online"
                    }
                    setOpenStripe={setSelectedPaymentMethod}
                  />
                )}
            </div>
          </div>
        </div>
        {/* <hr className="w-full text-[#e8e8e8]"></hr> */}
      </div>
    </>
  );
};

export default Paymentmethods;
