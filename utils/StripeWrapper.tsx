"use client";
import { CircularProgress } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { makeLeastSignificantDigitZero, validateEmail } from "./utilities";

const StripeWrapper = ({
  addressToDeliver,
  children,
  stripeData,
  paymentSummary,
  cashbackUsed,
  isCouponApplied,
}) => {
  const [secret, setSecret] = useState("");
  const [email, setemail] = useState(null);
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC);

  async function getClientSecret() {
    // if secret is exist not new create
    if (email == addressToDeliver.email) {
      return false;
    }
    setemail(addressToDeliver.email);
    try {
      let amount: number;
      if (
        stripeData?.currency === "OMR" ||
        stripeData?.currency === "KWD" ||
        stripeData?.currency === "BHD"
      ) {
        amount = makeLeastSignificantDigitZero(
          parseFloat(parseFloat(stripeData?.amount).toFixed(2)) * 1000
        );
      } else {
        amount = parseInt(
          (parseFloat(parseFloat(stripeData?.amount).toFixed(2)) * 100)
            .toString()
            .split(".")[0]
        );
      }

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_DOMAIN + "/api/stripe-intent",
        {
          method: "POST",
          body: JSON.stringify({
            ...stripeData,
            amount,
            // amount: 5120,
          }),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      console.log("STRIPE SECRET FOR", amount);
      const data = await res?.json();
      setSecret(data?.clientSecret);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // if (
    //   validateEmail(addressToDeliver.email) &&
    //   addressToDeliver.pincode &&
    //   addressToDeliver.city &&
    //   addressToDeliver.country
    // ) {
    getClientSecret();
    // }
  }, [paymentSummary, cashbackUsed, isCouponApplied, addressToDeliver]);

  return (
    <div className="w-full" key={secret || ""}>
      {secret ? (
        <Elements
          key={secret}
          stripe={stripePromise}
          options={{
            appearance: { theme: "stripe" },
            clientSecret: secret,
          }}
        >
          {children}
        </Elements>
      ) : (
        <div className=" w-full text-white py-2 px-2 hover:bg-white hover:text-black cursor-pointer  border border-primary h-[45px] md:h-[60px] bg-red-500 rounded-br-[10px] text-center text-xl font-semibold flex justify-center items-center">
          <CircularProgress size={25} className="!text-white" />
        </div>
      )}
    </div>
  );
};

export default StripeWrapper;
