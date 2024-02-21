"use client";
import { CircularProgress } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { makeLeastSignificantDigitZero } from "../../utils/utilities";

const WalletStripeWrapper = ({ children, stripeData, amount }) => {
  const [secret, setSecret] = useState("");
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC);

  async function getClientSecret() {
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
    const data = await res?.json();

    setSecret(data?.clientSecret);
  }

  useEffect(() => {
    if (amount) {
      getClientSecret();
    }
  }, [amount]);

  return (
    <>
      {secret ? (
        <Elements
          stripe={stripePromise}
          options={{
            appearance: { theme: "stripe" },
            clientSecret: secret,
          }}
        >
          {children}
        </Elements>
      ) : amount ? (
        <div className="">
          <CircularProgress
            className="!text-white"
            size={25}
          />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default WalletStripeWrapper;
