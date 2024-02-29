import { CircularProgress } from '@mui/material';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import React, { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { makeLeastSignificantDigitZero } from '../../../utils/utilities';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase-config';
export interface IStripeData {
    currency: string
    amount: number
    user: User
}

export interface User {
    name: string
    address: string
    phone: string,
    email: string,
}

interface MakeCheckoutProps {
    handleSubmit: Function;
    setIsTermsAgreed: React.Dispatch<React.SetStateAction<boolean>>;
    userNote: string;
    checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry: () => boolean;
    setUserNote: React.Dispatch<React.SetStateAction<string>>;
    isTermsAgreed: boolean;
    setSelectedPaymentMethod?: (method: string) => void | null;
    isCashBackUsed?: boolean;
    loading: boolean;
    selectedPaymentMethod: string,
    stripeData: IStripeData,
    setLoading: Function,
    state: string,
}

function MakeCheckout({
    handleSubmit,
    setIsTermsAgreed,
    userNote,
    checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry,
    setUserNote,
    isTermsAgreed,
    setSelectedPaymentMethod,
    isCashBackUsed = false,
    selectedPaymentMethod,
    loading,
    stripeData,
    setLoading,
    state
}: MakeCheckoutProps) {

    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmitPay = async (id) => {

        if (elements == null) {
            return;
        }

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
            // Show error to your customer
            toast.error(submitError.message + " on submit");
            return;
        }

        let amount: number;
        if (
            stripeData?.currency === "OMR" ||
            stripeData?.currency === "KWD" ||
            stripeData?.currency === "BHD"
        ) {
            amount = makeLeastSignificantDigitZero(
                parseFloat((stripeData?.amount).toFixed(2)) * 1000
            );
        } else {
            amount = parseInt(
                (parseFloat((stripeData?.amount).toFixed(2)) * 100)
                    .toString()
                    .split(".")[0]
            );
        }
        // Create the PaymentIntent and obtain clientSecret from your server endpoint
        setLoading(true)
        const res = await fetch(
            process.env.NEXT_PUBLIC_API_DOMAIN + "/api/stripe-intent",
            {
                method: "POST",
                body: JSON.stringify({
                    ...stripeData,
                    amount,
                }),
                headers: {
                    "content-type": "application/json",
                },
            }
        );

        const data = await res?.json();
        console.log(data);

        const clientSecret = data.clientSecret;

        const { error } = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            clientSecret,
            confirmParams: {
                return_url: process.env.NEXT_PUBLIC_API_DOMAIN + `/api/stripe/${id}`,
            },

        });
        // /${id}/complete/${clientSecret}
        if (error) {
            toast.error("Payment Rejected");
            // router.push("/payment-failed");
            window.location.replace(process.env.NEXT_PUBLIC_API_DOMAIN + `/api/stripe/error/${id}?payment_intent=${data.id}`);
            console.log(error);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.\
            setLoading(false);
        }
    };



    const handleNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserNote(e.target.value);
    };


    return (
        <div className="p-5 border rounded-lg">
            <div className=" flex flex-col gap-4 mt-4  ">
                <MakeCheckoutType allowCod={state == "Dubai"} setSelectedPaymentMethod={setSelectedPaymentMethod} value={selectedPaymentMethod} />
                <div className="w-full border border-gray-300 rounded-md">
                    <input
                        type="text"
                        value={userNote}
                        onChange={handleNoteChange}
                        placeholder="Add note"
                        className="w-full rounded-md select-none outline-none py-2 px-3"
                    />
                </div>
                {selectedPaymentMethod == "cash" ? null :
                    <PaymentElement options={{ wallets: { applePay: "auto", googlePay: "never" } }} />
                }
                <div className="w-full flex gap-2 items-center justify-between">
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            name=""
                            id=""
                            checked={isTermsAgreed}
                            onChange={(e) => {
                                setIsTermsAgreed(e.target.checked);
                            }}
                        />
                        <span className="text-[10px] sm:text-xs md:text-sm ">
                            I have read and agree to the website{" "}
                            <Link
                                href={"/terms-&-conditions"}
                                target="_blank"
                                className="underline underline-offset-2 "
                            >
                                terms and conditions
                            </Link>{" "}
                            <span className="text-primary">*</span>
                        </span>
                    </div>
                </div>
                <button
                    disabled={loading}
                    onClick={async () => {
                        if (
                            checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry()
                        ) {
                            return;
                        }

                        if (isCashBackUsed && setSelectedPaymentMethod) {
                            setSelectedPaymentMethod("cash");
                        }
                        if (selectedPaymentMethod == "cash") {
                            handleSubmit(true);
                        } else {
                            const id = await handleSubmit(false);
                            if (id) {
                                handleSubmitPay(id);
                            }
                        }

                    }}
                    className={`w-full text-white py-1 md:py-2 px-1 md:px-2 hover:bg-[#df191e]  cursor-pointer  border border-[#ed1c24] ${checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry()
                        ? "bg-[#ed1c23b5] hover:bg-[#ed1c23b5] cursor-not-allowed"
                        : "bg-[#ed1c24]"
                        } rounded-md text-center text-base sm:text-lg md:text-xl font-semibold`}
                >
                    {loading ? (
                        <CircularProgress className="!text-white" size={25} />
                    ) : (
                        "Place Order"
                    )}
                </button>
            </div>
        </div>
    );
}

export default MakeCheckout;




function MakeCheckoutType({ setSelectedPaymentMethod, value, allowCod }: { setSelectedPaymentMethod: Function, value: string, allowCod: boolean }) {
    return (
        <>
            {!allowCod ? null : <div className="flex items-center gap-2 p">
                <div
                    onClick={() => {
                        setSelectedPaymentMethod("cash")
                    }}
                    className="cursor-pointer bg-white shadow-lg h-4 w-4 rounded-full flex justify-center items-center"
                >
                    <span
                        className={` ${value === "cash"
                            ? "bg-primary"
                            : "bg-gray-300"
                            } h-1.5 w-1.5 rounded-full `}
                    ></span>
                </div>

                <p className=" font-semibold text-black text-base ">
                    Cash On Delivery
                </p>
                <p className="text-sm ">Pay with cash upon delivery.</p>
            </div>

            }
            <div className="  flex items-center gap-2 mt-3 mb-4">
                <div
                    onClick={() => {
                        setSelectedPaymentMethod("online")
                    }}
                    className="cursor-pointer bg-white shadow-lg h-4 w-4 rounded-full flex justify-center items-center"
                >
                    <span
                        className={` ${"online" === value
                            ? "bg-primary"
                            : "bg-gray-300"
                            } h-1.5 w-1.5 rounded-full `}
                    ></span>
                </div>

                <p className=" font-semibold text-black text-base ">
                    Pay Online
                </p>
            </div>
        </>
    )
}



