import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { auth, db, functions } from "../../config/firebase-config";
import { httpsCallable } from "firebase/functions";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const CouponSection = ({
  paymentSummary,
  setPaymentSummary,
  updatePaymentSummaryWithOverLayLoading,
  isCouponApplied,
  setOverLayLoading,
  setAppliedCouponAmount,
  setIsCouponApplied,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [couponText, setCouponText] = useState("");

  async function getGstInfo() {
    return await getDoc(doc(db, "payment", "info")).then((val) => {
      return val.data()?.isGstApplicable;
    });
  }

  async function applyCoupon() {
    if (!couponText) {
      return;
    }
    const verifyCoupon = httpsCallable(functions, "orders-verifyCouponCode");
    setOverLayLoading(true);
    setIsLoading(true);
    const gst = await getGstInfo();
    try {
      const couponResponse: any = await verifyCoupon({
        userId: auth.currentUser?.uid || "",
        isGstApplicable: gst,
        code: couponText,
        paymentDetails: paymentSummary,
      });
      if (!couponResponse?.data?.success) {
        setIsLoading(false);
        setOverLayLoading(false);
        toast.error(couponResponse?.data?.failureMsg);
        return;
      }

      setPaymentSummary({
        ...paymentSummary,
        totalPayable: couponResponse?.data?.details?.totalAmountToPaid,
        totalGst: couponResponse?.data?.details?.totalGst,
      });
      setAppliedCouponAmount({
        code: couponText,
        couponId: couponResponse?.data?.data?.couponId,
        discount: couponResponse?.data?.details?.totalCouponDiscount,
        newTotalAmount: couponResponse?.data?.details?.totalAmountToPaid,
        newGst: couponResponse?.data?.details?.totalGst,
      });
      setIsCouponApplied(true);
      setIsLoading(false);
      setOverLayLoading(false);
    } catch (error) {
      setIsLoading(false);
      setOverLayLoading(false);
    }
  }

  async function removeCoupon() {
    try {
      setIsLoading(true);
      await updatePaymentSummaryWithOverLayLoading();
      setIsCouponApplied(false);
      setAppliedCouponAmount(null);
      setCouponText("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-md bg-[#f9f8f8] border border-[#e8e8e8]   py-3 px-body">
      <h5 className="font-semibold ">Apply Coupon Code</h5>
      <div className="flex gap-2 w-full items-center">
        <input
          type="text"
          disabled={isCouponApplied}
          value={couponText}
          onChange={(e) => {
            setCouponText(e.target.value);
          }}
          className="w-[90%] py-1 px-3 rounded-md outline-none border-gray-200 border "
          placeholder="Enter Coupon Code"
        />
        {isCouponApplied ? (
          <button
            onClick={removeCoupon}
            className="w-auto text-center text-primary font-semibold"
          >
            {isLoading ? (
              <CircularProgress
                size={25}
                className="!text-primary"
              ></CircularProgress>
            ) : (
              "Remove"
            )}
          </button>
        ) : (
          <button
            onClick={applyCoupon}
            className="w-auto text-center text-primary font-semibold"
          >
            {isLoading ? (
              <CircularProgress
                size={25}
                className="!text-primary"
              ></CircularProgress>
            ) : (
              "Apply"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CouponSection;
