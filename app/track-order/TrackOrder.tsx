"use client";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../config/firebase-config";
import { useAppSelector } from "../../redux/hooks";
import Image from "next/image";
import { constant } from "../../utils/constants";
import Hr from "../../components/Hr/Hr";
import { CircularProgress } from "@mui/material";

const TrackOrder = () => {
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );
  const [state, setState] = useState({ orderId: "", email: "" });
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(name, value) {
    setState({ ...state, [name]: value });
  }

  async function trackOrder() {
    const { orderId, email } = state;
    if (!email || !orderId) {
      toast.error("Enter Details");
    }

    setIsLoading(true);
    try {
      await getDocs(
        query(
          collection(db, `orders`),
          where("orderId", "==", +orderId),
          where("address.email", "==", email)
        )
      ).then((val) => {
        if (val.docs.length === 0) {
          toast.error("No order found");
          return;
        }
        const data = val.docs[0].data();
        if (data) {
          setOrderData(data);
          setIsLoading(false);
        }
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 px-body my-6">
      <h1 className="font-semibold text-3xl">Track Your Order</h1>
      <p>
        To track your order please enter your Order ID in the box below and
        press the "Track" button. This was given to you on your receipt and in
        the confirmation email you should have received.
      </p>
      <div className="flex lg:flex-row flex-col lg:gap-12 gap-4 mt-3">
        <div className="flex-1 flex flex-col gap-1">
          <p className="font-semibold">Order ID</p>
          <div className="relative w-full h-full flex items-center border border-gray-300  rounded-lg">
            <div className="flex w-full">
              <input
                type="text"
                name="orderId"
                placeholder="Found in your order confirmation email."
                value={state?.orderId}
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
                className="py-2 px-2 rounded-lg w-full outline-none focus:border-none"
                //   onChange={(e) => {
                //     setSearchQuery(e.target.value);
                //   }}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <p className="font-semibold">Billing email</p>
          <div className="relative w-full h-full flex items-center border border-gray-300  rounded-lg">
            <div className="flex w-full">
              <input
                type="text"
                name="email"
                placeholder="Email you used during checkout"
                value={state?.email}
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
                className="py-2 px-2 rounded-lg w-full outline-none focus:border-none"
                //   onChange={(e) => {
                //     setSearchQuery(e.target.value);
                //   }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className=" flex justify-center items-center w-fit mb-5 rounded-md mt-4">
        <button
          disabled={isLoading}
          onClick={trackOrder}
          className="flex-1 flex justify-center items-center py-2 px-10 font-semibold rounded-md bg-primary text-white hover:bg-white hover:text-black border border-primary"
        >
          {isLoading ? (
            <CircularProgress size={25} className="!text-white" />
          ) : (
            "Track"
          )}
        </button>
      </div>

      {orderData && (
        <div className="mt-3">
          <div>
            <div className="w-full  ">
              <div className=" ">
                <div className="flex justify-between bg-primary rounded-tr-lg rounded-tl-lg px-5 py-2.5 text-white sm:text-sm text-xs">
                  <div>Order Number : {orderData?.orderId}</div>
                </div>
                <div className="border-l border-l-gray-400 border-r border-r-gray-400 border-b border-b-gray-400">
                  <div className="flex justify-between items-center xl:px-5 px-5 py-5 ">
                    <div className="flex flex-col gap-2">
                      <p className="font-semibold sm:text-sm text-xs flex gap-2 items-center">
                        Status:{" "}
                        <span>
                          {" "}
                          <p className="text-[#FFAB07] sm:text-sm text-xs bg-[#FFF8EC] px-5 py-1.5">
                            {orderData?.status}
                          </p>
                        </span>
                      </p>
                      <p className="font-semibold sm:text-sm text-xs">
                        Payment mode:{" "}
                        <span className="font-normal">
                          {orderData?.payment?.mode} (
                          {orderData?.payment?.completed ? "Paid" : "Pending"})
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-7 ">
                    {orderData.products.map((item: any, idx: number) => {
                      return (
                        <div key={idx} className="md:px-5 px-3 ">
                          <div
                            className={`flex lg:flex-row flex-col lg:items-center justify-between gap-5 h-auto    cursor-pointer `}
                          >
                            <div className="flex items-center sm:gap-x-8 gap-x-4 ">
                              <div className="h-[108px] w-[108px] ">
                                <Image
                                  src={
                                    item?.img
                                      ?.toString()
                                      ?.includes("assets/img")
                                      ? constant.errImage
                                      : item?.img?.url
                                  }
                                  alt={item?.name || ""}
                                  width={1000}
                                  height={1000}
                                  className=" h-[100%] w-[100%] object-fill "
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <h2 className="xl:text-base text-sm font-semibold line-clamp-1 ">
                                  {" "}
                                  {item?.name}
                                </h2>

                                <div className="flex items-center gap-2 text-[#555555] xl:text-sm text-xs font-medium ">
                                  <span>Size : </span>{" "}
                                  <span>
                                    {/* {item?.pack?.weight} */}
                                    {item?.pack?.weight?.split("/") &&
                                      item?.pack?.weight?.split("/")[0]}
                                  </span>{" "}
                                  {item?.pack?.weight?.includes("/") ? (
                                    <div>
                                      <span>|</span> Color :{" "}
                                      <span>
                                        {/* {item?.color?.name} */}
                                        {item?.pack?.weight?.split("/")[1]}
                                      </span>
                                    </div>
                                  ) : null}
                                </div>
                                <h5 className="text-[#555555] xl:text-sm text-xs">
                                  Qty : {item?.quantity}
                                </h5>

                                <div className="flex items-center   gap-4 mt-3 ">
                                  <p className="text-center text-black xl:text-base text-sm font-bold leading-[29px]">
                                    {orderData?.currency || currency}{" "}
                                    {item?.price}
                                  </p>
                                  <p className=" text-[#555555] xl:text-sm text-xs font-semibold line-through">
                                    {orderData?.currency || currency}{" "}
                                    {item?.mrpPrice}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* <div className='flex flex-col items-center  gap-2'>
              <h3 className='text-xs text-[#555555]'>Expected date by :</h3>
              <h3 className='text-sm font-semibold'>22nd August 2023</h3>
            </div> */}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="md:px-5 px-3">
                    <Hr></Hr>
                  </div>
                  <div className="">
                    <h3 className="xl:text-xl text-base font-semibold px-5 mt-5">
                      Address Details
                    </h3>
                    <div className="flex flex-col gap-2 md:px-5 px-3 mt-2">
                      <p className="font-semibold">
                        Name :{" "}
                        <span className="font-normal">
                          {orderData?.address?.name}
                        </span>
                      </p>
                      <p className="font-semibold">
                        Email :{" "}
                        <span className="font-normal">
                          {orderData?.address?.email}
                        </span>
                      </p>
                      <p className="font-semibold">
                        Phone :{" "}
                        <span className="font-normal">
                          {orderData?.address?.phoneNo}
                        </span>
                      </p>
                      <p className="font-semibold">
                        Address :{" "}
                        <span className="font-normal">
                          {orderData?.address?.address}
                        </span>
                      </p>
                      <p className="font-semibold">
                        Country :{" "}
                        <span className="font-normal">
                          {orderData?.address?.country}
                        </span>
                      </p>
                      <p className="font-semibold">
                        City :{" "}
                        <span className="font-normal">
                          {orderData?.address?.city ||
                            orderData?.address?.state}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="md:px-5 px-3">
                    <Hr></Hr>
                  </div>
                  <div>
                    <div>
                      <h2 className="xl:text-xl text-base font-semibold px-5 mt-5">
                        Order Summary
                      </h2>
                    </div>
                    <div className=" w-full flex flex-col gap-3 px-7 py-5">
                      <div className="flex justify-between xl:text-base text-sm ">
                        <h3 className="text-gray-500 font-medium">Subtotal</h3>
                        <h3 className="t font-semibold">
                          {orderData?.currency || currency}{" "}
                          {orderData?.totalMrp}
                        </h3>
                      </div>
                      <div className="flex justify-between xl:text-base text-sm ">
                        <h3 className="text-gray-500 ">Shipping Fees</h3>
                        <h3 className="font-semibold">
                          {orderData?.delivery
                            ? `${orderData?.currency || currency} ${
                                orderData?.delivery
                              }`
                            : "Free"}
                        </h3>
                      </div>
                      {orderData?.discountOnMrp ? (
                        <div className="flex justify-between xl:text-base text-sm ">
                          <h3 className="text-gray-500"> Discount</h3>
                          <h3 className="font-semibold">
                            {orderData?.currency || currency}{" "}
                            {orderData?.discountOnMrp}
                          </h3>
                        </div>
                      ) : (
                        <></>
                      )}
                      {orderData?.couponDiscount ? (
                        <div className="flex justify-between xl:text-base text-sm ">
                          <h3 className="text-gray-500">Coupon Discount</h3>
                          <h3 className="font-semibold">
                            {orderData?.currency || currency}{" "}
                            {orderData?.couponDiscount}
                          </h3>
                        </div>
                      ) : (
                        <></>
                      )}
                      {orderData?.cashbackAmount ? (
                        <div className="flex justify-between xl:text-base text-sm ">
                          <h3 className="text-gray-500">Cashback Used</h3>
                          <h3 className="font-semibold">
                            {orderData?.currency || currency}{" "}
                            {orderData?.cashbackAmount}
                          </h3>
                        </div>
                      ) : (
                        <></>
                      )}

                      <div className="w-full border-b border-b-gray-500 xl:text-base text-sm  my-1"></div>
                      <div className="flex justify-between xl:text-base text-sm ">
                        <h3 className="font-semibold">Total</h3>
                        <h3 className="font-semibold">
                          {orderData?.currency || currency}{" "}
                          {orderData?.totalAmountToPaid}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
