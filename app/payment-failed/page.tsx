"use client";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { db } from "../../config/firebase-config";
import Link from "next/link";

const PaymentFailed = ({ searchParams }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
      <div>
        <h1 className="text-2xl font-semibold">
          Your Payment Was Unsuccessful
        </h1>
      </div>

      <Link href={"/"} className="bg-primary text-white px-3 py-1 rounded-md">
        Go To Home
      </Link>
    </div>
  );
};

export default PaymentFailed;
