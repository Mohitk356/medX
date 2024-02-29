"use client";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import TagManager from "react-gtm-module";
import { db } from "../../config/firebase-config";
import { useAppSelector } from "../../redux/hooks";

const PaymentSuccess = ({ searchParams }) => {
  const [dataPushed, setDataPushed] = useState(false);
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );
  // const
  async function pushDataLayer() {
    const orderData = (
      await getDoc(doc(db, "orders", searchParams?.orderId))
    ).data();
    TagManager.dataLayer({
      dataLayer: {
        event: "Order Placed",
        value: (orderData?.totalAmountToPaid * currRate).toFixed(2),
        tax: (orderData?.defaultGst * currRate).toFixed(2),
        shipping: (orderData?.delivery * currRate).toFixed(2),
        currency: orderData?.currency,
      },
    });
  }

  function createButton() {
    const button = document.createElement("button");
    button.onclick = pushDataLayer;
    console.log(" CLICKing");
    button.click();
  }

  async function updateRecord() {
    if (searchParams?.redirect_status === "succeeded") {
      if (searchParams?.orderId) {
        await updateDoc(doc(db, "orders", searchParams?.orderId), {
          status: "Confirmed",
          "payment.completed": true,
          "payment.details": {
            paymentIntent: searchParams?.payment_intent || "",
          },
        });
      }
    }
    setDataPushed(true);
    // createButton();
  }

  useEffect(() => {
    if (dataPushed) {
      createButton();
    }
  }, [dataPushed]);

  useEffect(() => {
    updateRecord();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
      <div>
        <h1 className="text-2xl font-semibold">
          {searchParams?.mode && searchParams?.mode === "cash"
            ? "Order Placed Successfully"
            : "Your Payment Was Successfull"}
        </h1>
      </div>
      <div>
        <h1 className="text-lg font-medium text-gray-600">
          {searchParams?.mode && searchParams?.mode === "cash"
            ? "Check your order details from My orders section in profile"
            : "Order Placed Successfully"}
        </h1>
      </div>

      <Link href={"/"} className="bg-primary text-white px-3 py-1 rounded-md">
        Go To Home
      </Link>
    </div>
  );
};

export default PaymentSuccess;
