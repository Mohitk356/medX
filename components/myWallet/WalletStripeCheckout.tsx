"use client";
import { CircularProgress } from "@mui/material";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../config/firebase-config";
import { getUserData } from "../../utils/databaseService";

export default function WalletStripeCheckout(props) {
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(props.cookie),
    keepPreviousData: true,
  });

  const queryClient = useQueryClient();
  const stripe = useStripe();
  const pathName = usePathname();
  const elements = useElements();
  const [cardReady, setCardReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    let stripeObj: any = {
      elements,
    };

    stripeObj = {
      ...stripeObj,
      redirect: "if_required",
    };

    const result = await stripe.confirmPayment(stripeObj);

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      toast.error("Payment Rejected");
      router.push("/payment-failed");
      setLoading(false);
      console.log(result.error.message);
    } else {
      let paymentData = {
        completed: true,
        mode: "stripe",
        details: {
          paymentIntent: result.paymentIntent.id,
        },
      };

      await setDoc(
        doc(db, "orders", props.orderId),
        {
          payment: paymentData,
          status: "Confirmed",
        },
        { merge: true }
      );

      await queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      await queryClient.refetchQueries({ queryKey: ["userOrders"] });
      toast.success("Payment Successfull");
      props.setIsOrderPage(false);
      props.setIsPaymentModalOpen(false);
    }
  };

  return (
    <div className="w-full   flex-1 bg-white px-8 py-8 rounded-md">
      <form onSubmit={handleSubmit} id="payment">
        <PaymentElement
          options={{}}
          onReady={(ele) => {
            // ele.
          }}
        />
        <button
          className=" mt-3 px-3 py-2 bg-black text-white rounded-md flex justify-center items-center"
          onClick={loading ? null : handleSubmit}
        >
          {loading || !stripe ? (
            <CircularProgress size={25} className="!text-white" />
          ) : (
            `Pay ${props.amount} ${props?.currency}`
          )}
        </button>
      </form>
    </div>
  );
}
