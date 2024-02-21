"use client";

import { useState } from "react";
import OrderItem from "../orderitem/OrderItem";
import { functions } from "../../config/firebase-config";
import { httpsCallable } from "firebase/functions";
import { Bars } from "react-loader-spinner";

const SingleOrderCard = ({ singleorder, setOrderPageData, setIsOrderPage }) => {
  let singleorderarr = singleorder;

  const totalQuantity = singleorderarr?.products?.reduce((prevsum, product) => {
    return prevsum + product.quantity;
  }, 0);

  const [isOrderTracking, setIsOrderTracking] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState(null);

  async function trackOrder() {
    try {
      setIsOrderTracking(true);
      console.log(
        "Tracking",
        singleorderarr?.externalIntegration?.delivery?.trackingId
      );

      const trackStatus = httpsCallable(functions, "shipment-trackOrderStatus");
      const data = await trackStatus({
        trackingId: singleorderarr?.externalIntegration?.delivery?.trackingId,
      });

      const response = data.data;

      console.log("Tracking", response);
      setTrackingStatus(response);
      setIsOrderTracking(false);
    } catch (error) {
      setIsOrderTracking(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 rounded-br-[20px]  border border-primary pb-2 md:pb-4 ">
      <div className="flex  bg-[#FAEFEF] items-center py-1 px-1 md:py-3 md:px-3 gap-3 border-primary border-b">
        <div className="flex items-start sm:items-center flex-col sm:flex-row justify-between w-full">
          <p className="text-black text-xs md:text-sm font-semibold  tracking-tight">
            Order Id : {singleorderarr.orderId}
          </p>

          <p className="text-black text-xs md:text-sm font-semibold   tracking-tight">
            Items : {singleorderarr?.products?.length} | Qty : {totalQuantity}
          </p>
        </div>
        <div className=" px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-[white] rounded-full ">
          <button
            onClick={() => {
              setIsOrderPage(true);
              setOrderPageData(singleorderarr);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-[10px] sm:text-xs md:text-sm font-semibold text-primary w-max"
          >
            View Order Details
          </button>
        </div>
      </div>

      <div className=" flex flex-col justify-between gap-1 md:gap-4 px-3 text-base">
        {singleorderarr &&
          singleorderarr?.products?.map((singleproduct: any, idx: number) => {
            return <OrderItem product={singleproduct} />;
          })}
      </div>

      {singleorderarr &&
        singleorderarr?.externalIntegration &&
        singleorderarr?.externalIntegration?.delivery &&
        singleorderarr?.externalIntegration?.delivery?.trackingId && (
          <div className="flex justify-between items-center px-3">
            <div className="flex flex-col items-end justify-center gap-3">
              <button
                className="text-primary underline text-sm"
                onClick={trackOrder}
              >
                Track Order
              </button>
            </div>

            {
              isOrderTracking ? (
                <Bars
                  height="20"
                  width="80"
                  color="#E64040"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              ) : (
                trackingStatus && (
                  <p className="text-sm">{trackingStatus?.lastStatus}</p>
                )
              )
              // {/* <p className="text-sm">UDERSAOIBSCAO</p> */}
            }
          </div>
        )}
    </div>
  );
};
export default SingleOrderCard;
