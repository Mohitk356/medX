"use client";

import React, { useState } from "react";
import SingleOrderCard from "../singleorder/SingleOrder";
import OrderDetailsPage from "./OrderDetailsPage";

const MyOrders = (userOrders) => {
  const [IsOrderPage, setIsOrderPage] = useState(false);
  const [orderPageData, setOrderPageData] = useState("");
  let orderarr = userOrders.userOrders;

  return (
    <>
      {IsOrderPage ? (
        <OrderDetailsPage
          singleOrder={orderPageData}
          setIsOrderPage={setIsOrderPage}
        />
      ) : (
        <div className="flex flex-col gap-8">
          {userOrders && orderarr?.length === 0 ? (
            <div className="flex flex-col justify-center items-center flex-1 min-h-[400px] h-full">
              '<p className="font-semibold">No Orders Found</p>
            </div>
          ) : (
            orderarr?.map((singleorder: any, idx: number) => {
              return (
                <SingleOrderCard
                  setIsOrderPage={setIsOrderPage}
                  setOrderPageData={setOrderPageData}
                  singleorder={singleorder}
                />
              );
            })
          )}
        </div>
      )}
    </>
  );
};
export default MyOrders;
