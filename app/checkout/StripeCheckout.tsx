"use client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { collection, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../../config/firebase-config";
import { getUserData } from "../../utils/databaseService";
import PlaceOrder from "./PlaceOrder";

export default function StripeCheckout(props) {
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(null),
    keepPreviousData: true,
  });
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isElementUpdating, setIsElementUpdating] = useState(false);

  const handleSubmit = async (event) => {
    if (!props.isTermsAgreed) {
      toast.error(
        "Please Agree to Terms & Conditions before placing your order"
      );
      return;
    }
    if (props.isWallet) {
      event.preventDefault();
    }

    if (!stripe || !elements) {
      return;
    }

    await elements.fetchUpdates();

    props?.setLoading(true);
    let docId;
    if (!props?.isWallet) {
      docId = await props.placeOrder({ isCod: false });
    }
    if (!docId) {
      props?.setLoading(false);
      return;
    }

    let stripeObj: any = {
      elements,
    };
    stripeObj = {
      ...stripeObj,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success/?orderId=${docId}&mode=online`,
      },
    };

    const result = await stripe.confirmPayment(stripeObj);

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)

      await updateDoc(doc(db, "orders", docId), {
        "payment.status": "failed",
        "payment.details": { ...result.error },
      });
      toast.error("Payment Rejected");
      router.push("/payment-failed");
      console.log(result.error.message);
    } else {
      let uid = auth.currentUser?.uid;
      if (uid) {
        let docId = doc(collection(db, `users/${uid}/walletTransactions`)).id;
        // await addDoc(
        //   collection(db, `users/${uid}/walletTransactions`),
        //   result?.paymentIntent
        // );
      }

      // let amount = parseFloat(props?.amount?.toString());

      // var walletPaymentObj = {
      //   uid: uid.toString(),
      //   mode: "stripe",
      //   txnDetails: result?.paymentIntent,
      //   amount: amount,
      //   balance: userData?.wallet?.balance,
      //   txnId: docId,
      // };

      // const addToWallet = httpsCallable(
      //   functions,
      //   "wallet-addMoneyToWalletByUser"
      // );
      // await addToWallet(walletPaymentObj);

      // toast.success("Money Added to Wallet");

      // props.setOpenStripe(false);
    }
  };

  // useEffect(() => {
  //   setIsElementUpdating(true);
  //   elements.fetchUpdates();
  //   setIsElementUpdating(false);
  // }, []);

  return (
    <div className="w-full py-2  flex-1 ">
      {/* <form onSubmit={handleSubmit} id="payment"> */}
      {!isElementUpdating && (
        <PaymentElement
          key={props?.paymentSummary?.totalPayable}
          options={{ wallets: { applePay: "never", googlePay: "never" } }}
          onReady={(ele) => {
            // ele.
          }}
        />
      )}
      <PlaceOrder
        checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry={
          props.checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry
        }
        userNote={props.userNote}
        setUserNote={props.setUserNote}
        loading={props.loading}
        handleSubmit={handleSubmit}
        isTermsAgreed={props.isTermsAgreed}
        setIsTermsAgreed={props?.setIsTermsAgreed}
      />
      {/* </form> */}
    </div>
  );
}
