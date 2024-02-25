"use client";

import { useQuery } from "@tanstack/react-query";
import { addDoc, collection, doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CheckoutOrders from "../../components/checkout/CheckoutOrders";
import CouponSection from "../../components/checkout/CouponSection";
import NewAddress from "../../components/checkout/newAddress";
import CheckoutNav from "../../components/checkoutnav/CheckoutNav";
import CheckoutProgress from "../../components/checkoutnav/CheckoutProgress";
import { auth, db, functions } from "../../config/firebase-config";
import { usePrevious } from "../../hooks/usePrevious";
import cards from "../../images/cards.png";
import { useAppSelector } from "../../redux/hooks";
import { reset } from "../../redux/slices/cartSlice";
import StripeWrapper from "../../utils/StripeWrapper";
import { getGstAppilicableInfo } from "../../utils/cartUtilities/cartUtility";
import {
  addAddressToUser,
  getCountries,
  getUserData,
  getWalletInfo,
  updateDefaultAddress,
} from "../../utils/databaseService";
import { getCountry, initialAddress } from "../../utils/utilities";
import Paymentmethods from "./Paymentmethods";
import PlaceOrder from "./PlaceOrder";
import SubtotalComponent from "./SubTotalComponent";

const CheckoutPage = () => {
  const { data: allowedCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
    keepPreviousData: true,
  });
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(null),
    keepPreviousData: true,
  });
  const { data: walletInfo } = useQuery({
    queryKey: ["walletInfo"],
    queryFn: () => getWalletInfo(),
    keepPreviousData: true,
  });

  const [isCashBackUsed, setIsCashbackUsed] = useState(false);
  const [cashBackUsed, setCashBackused] = useState(0);
  const [saveAddress, setSaveAddress] = useState(false);
  const [makeDefault, setMakeDefault] = useState(false);

  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );
  const cart = useAppSelector((state: any) => state.cartReducer.cart);

  const [loading, setLoading] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [overLayLoading, setOverLayLoading] = useState(false);
  const [isPaymentSummaryLoading, setIsPaymentSummaryLoading] = useState(false);
  const [makeDefaultAddress, setMakeDefaultAddress] = useState(true);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("online");
  const [userNote, setUserNote] = useState("");
  const [userName, setName]: any = useState({ first: "", last: "" });
  const [paymentSummary, setPaymentSummary] = useState(null);

  const [userAddress, setUserAddress] = useState(
    (userData && userData?.defaultAddress) || initialAddress
  );

  const [addressToDeliver, setAddressToDeliver] = useState(
    (userData && userData?.defaultAddress) || initialAddress
  );

  const [isNewAddress, setIsNewAddress] = useState(
    !(userData && userData?.defaultAddress)
  );

  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [appliedCouponAmount, setAppliedCouponAmount] = useState(null);

  const prevValue = usePrevious(addressToDeliver?.country || "");

  const dispatch = useDispatch();
  const router = useRouter();

  async function getPaymentSummary() {
    if (!cart || (cart && cart.length === 0)) {
      router.push("/cart");
      return;
    }
    setIsPaymentSummaryLoading(true);
    const getPaymentSummaryDetails = httpsCallable(
      functions,
      "orders-getOrderPaymentDetails"
    );
    // alert(JSON.stringify(getPaymentSummaryDetails));
    const isGst = await getGstAppilicableInfo();
    let data = {
      address: {
        ...addressToDeliver,
        country: addressToDeliver?.country?.trim(),
      },
      products: cart,
      isGstApplicable: isGst,
      customDeliverySettings: null,
    };

    const res = await getPaymentSummaryDetails(data);

    setIsPaymentSummaryLoading(false);
    let summaryData: any = res.data;

    if (summaryData?.delivery?.country !== addressToDeliver?.country?.trim()) {
      return await getPaymentSummary();
    }

    setIsCouponApplied(false);
    setAppliedCouponAmount(null);
    setPaymentSummary(summaryData);
    console.log("Summery ", summaryData);
  }

  const handleChange = (name, value) => {
    setAddressToDeliver((val) => {
      return { ...val, [name]: value };
    });
  };

  function getConditionForCashPaymentBackendFunction() {
    if (!isCashBackUsed) {
      return false;
    }

    if (parseFloat(paymentSummary?.totalPayable) < walletInfo.minOrderAmnt) {
      const totalAmount = parseFloat(paymentSummary?.totalPayable);
      const wallet = userData.wallet.balance;

      if (totalAmount - wallet <= 0) {
        return true;
      }
      return false;
    } else {
      const totalAmount = parseFloat(paymentSummary?.totalPayable);
      const cashBack = userData?.wallet?.cashback;
      const usableCashback =
        parseFloat(cashBack) > walletInfo?.maxWalletAmntPerOrder
          ? walletInfo?.maxWalletAmntPerOrder
          : parseFloat(cashBack);
      const wallet = userData?.wallet?.balance;

      if (totalAmount - usableCashback - parseFloat(wallet) <= 0) {
        return true;
      }
      return false;
    }
  }

  async function placeOrder({ isCod = true }) {
    if (!isTermsAgreed) {
      toast.error(
        "Please Agree to Terms & Conditions before placing your order"
      );
      return;
    }
    // if(addressToDeliver?.country)
    const { address, name, phoneNo, state, country }: any = {
      ...addressToDeliver,
    };

    if (!address || !phoneNo || !state || !name || !country) {
      toast.error("Please enter address correctly");
      return;
    }

    if (/^[0-9]{3,14}$/.test(phoneNo) === false) {
      // alert(phoneNo);
      toast.error("Enter valid phone number without country code.");
      return;
    }

    if (
      addressToDeliver?.email &&
      /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(addressToDeliver?.email) ===
        false
    ) {
      toast.error("Enter valid email.");
      return;
    }

    if (
      addressToDeliver?.pincode &&
      /^\d+$/.test(addressToDeliver?.pincode) === false
    ) {
      toast.error("Enter valid pincode.");
      return;
    }

    let orderObj = {
      delivery: paymentSummary?.delivery?.deliveryCost || 1,
      couponDiscount: 0,
      defaultGst: paymentSummary?.totalGst || 0,
      totalAmountToPaid: paymentSummary?.totalPayable,
      couponId: appliedCouponAmount ? appliedCouponAmount?.couponId : "", //coupon
      couponName: "", //coupon,
      scheduledDate: "",
      scheduledTime: "",
      totalMrp: paymentSummary?.totalMrp, // from backend
      discountOnMrp: paymentSummary?.discountOnMrp, // from backend
      deliveryGstObj: paymentSummary?.deliveryGstObj, // from backend
      customerGstNo: "",
      billingAddress: addressToDeliver,
      userNote: userNote || "",
      currency,
      description: "This IS For Test",
      autoConfirmOrder: true, // collection payment -> info
      storePickupObj: {},
      metaData: {
        source: "web",
        orderBy: {
          id: userData ? userData?.id : "Guest",
          name: userData ? userData?.name : addressToDeliver?.name || "",
          role: "user",
        },
        inventoryManaged: false,
      },
      products: paymentSummary?.products,
      address: addressToDeliver,
      orderId: null,
      status: selectedPaymentMethod === "cash" ? "Confirmed" : "Pending",
      createdAt: new Date(),
      payment: {
        completed: false,
        mode:
          selectedPaymentMethod === "cash" ? selectedPaymentMethod : "stripe",
        details: null,
      },

      msgId: auth.currentUser?.uid
        ? doc(collection(db, "chats", auth.currentUser?.uid, "messages")).id
        : sessionStorage.getItem("guestLogin")
        ? null
        : "",
      userName: userData?.name || addressToDeliver?.name,
      region: "",
    };

    if (sessionStorage.getItem("guestLogin") && !auth.currentUser?.uid) {
      orderObj["guestLogin"] = true;
    }

    if (auth?.currentUser?.uid) {
      orderObj["userId"] = auth.currentUser?.uid;
    } else {
      orderObj["userId"] = null;
    }

    if (isCashBackUsed) {
      orderObj["cashbackAmount"] = cashBackUsed;
    }

    let orderId;
    setLoading(true);
    if (makeDefault) {
      await updateDefaultAddress({
        ...addressToDeliver,
        createdAt: new Date(),
      });
    }
    if (saveAddress) {
      await addAddressToUser({ ...addressToDeliver, createdAt: new Date() });
    }

    orderId = (await addDoc(collection(db, "orders"), orderObj)).id;

    dispatch(reset());
    if (isCod) {
      toast.success("Order Placed Successfully");
      setLoading(false);

      // try {
      //   if (selectedPaymentMethod === "cash") {
      //     if (getConditionForCashPaymentBackendFunction()) {
      //       const orderPaymentWithWallet = httpsCallable(
      //         functions,
      //         "wallet-orderPaymentWithWallet"
      //       );
      //       await orderPaymentWithWallet.call({
      //         ...orderObj,
      //         createdAt: "",
      //         orderDocId: orderId,
      //       });
      //     } else {
      //       const ac_paymentWithCash = httpsCallable(
      //         functions,
      //         "payments-ac_paymentWithCash"
      //       );
      //       await ac_paymentWithCash.call({
      //         ...orderObj,
      //         createdAt: "",
      //         orderDocId: orderId,
      //       });
      //     }
      //   }
      // } catch (error) {
      //   console.log("ERROR", error);
      // }

      router.push(`/payment-success/?orderId=${orderId}&mode=cash`);
    } else {
      return orderId;
    }
  }

  async function updatePaymentSummaryWithOverLayLoading() {
    setOverLayLoading(true);

    if (!cart || (cart && cart.length === 0)) {
      router.push("/cart");
      setOverLayLoading(false);
      return;
    }
    const getPaymentSummaryDetails = httpsCallable(
      functions,
      "orders-getOrderPaymentDetails"
    );

    const isGst = await getGstAppilicableInfo();
    let data = {
      address: {
        ...addressToDeliver,
        city: addressToDeliver?.state,
        country: addressToDeliver?.country?.trim(),
      },
      products: cart,
      isGstApplicable: isGst,
      customDeliverySettings: null,
    };
    const res: any = await getPaymentSummaryDetails(data);

    if (res?.data?.delivery?.country !== addressToDeliver?.country?.trim()) {
      return await updatePaymentSummaryWithOverLayLoading();
    }
    setIsCouponApplied(false);
    setAppliedCouponAmount(null);
    setPaymentSummary(res.data);
    setOverLayLoading(false);
  }

  function handleAddressSubmit() {
    const {
      address,
      city,
      lat,
      lng,
      name,
      phoneNo,
      pincode,
      state,
      stateCode,
    } = userAddress;

    if (!address || !city || !phoneNo || !state || !name) {
      console.log("ENTER DETAILS CORRECTLY", userAddress);

      return;
    }

    if (makeDefaultAddress) {
      updateDefaultAddress({
        ...userAddress,
        country: getCountry(allowedCountries, currency)?.countryName,
      });
    }
    addAddressToUser({
      ...userAddress,
      country: getCountry(allowedCountries, currency)?.countryName,
    });
    setAddressToDeliver({
      ...userAddress,
      country: getCountry(allowedCountries, currency)?.countryName,
    });
  }

  useEffect(() => {
    getPaymentSummary();
  }, []);

  useEffect(() => {
    if (
      prevValue === "" ||
      addressToDeliver?.country === "United Arab Emirates" ||
      (prevValue === "United Arab Emirates" &&
        addressToDeliver?.country !== "United Arab Emirates")
    )
      updatePaymentSummaryWithOverLayLoading();
  }, [addressToDeliver?.country]);

  useEffect(() => {
    if (addressToDeliver?.country === "United Arab Emirates") {
      updatePaymentSummaryWithOverLayLoading();
    }
  }, [addressToDeliver?.state]);

  async function getUsedCashback() {
    if (isCashBackUsed && walletInfo) {
      let usableCashback =
        userData?.wallet?.cashback < walletInfo?.maxWalletAmntPerOrder
          ? userData?.wallet?.cashback > paymentSummary?.totalPayable
            ? paymentSummary?.totalPayable
            : userData?.wallet?.cashback
          : walletInfo?.maxWalletAmntPerOrder > paymentSummary?.totalPayable
          ? paymentSummary?.totalPayable
          : walletInfo?.maxWalletAmntPerOrder;
      return setCashBackused(usableCashback);
    } else {
      setCashBackused(0);
    }
  }

  useEffect(() => {
    getUsedCashback();
  }, [isCashBackUsed, paymentSummary]);

  function checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry() {
    let response = false;
    if (paymentSummary) {
      for (let index = 0; index < paymentSummary?.products.length; index++) {
        const element = paymentSummary?.products[index];
        if (
          element?.restrictedCountries &&
          element?.restrictedCountries?.includes(addressToDeliver?.country)
        ) {
          response = true;
          break;
        }
      }
    }

    return response;
  }

  function checkIfCashbackCoversTheTotalAmount() {
    if (cashBackUsed >= paymentSummary?.paymentSummary?.totalPayable) {
      return true;
    }
    return false;
  }

  return (
    <div className="px-body ">
      <CheckoutNav />
      <CheckoutProgress />

      <div className="w-full flex md:flex-row flex-col gap-4 sm:gap-8 md:gap-16  my-6 sm:my-8 md:my-10 ">
        <div className="w-full md:w-[55%]  flex flex-col ">
          <div className="flex justify-between items-center ">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black ">
              Billing Details
            </h2>
          </div>
          <NewAddress
            setSaveAddress={setSaveAddress}
            setMakeDefault={setMakeDefault}
            userData={userData}
            setName={setName}
            userAddress={addressToDeliver}
            setUserAddress={setAddressToDeliver}
            makeDefaultAddress={makeDefaultAddress}
            setMakeDefaultAddress={setMakeDefaultAddress}
            isNewAddress={isNewAddress}
            setIsNewAddress={setIsNewAddress}
            handleAddressSubmit={handleAddressSubmit}
            handleChange={handleChange}
          />
        </div>

        <div className="w-full md:w-[45%]  flex flex-col gap-3 sm:gap-4 md:gap-5 ">
          <div className="flex justify-between items-center ">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black ">
              Your order
            </h2>
          </div>
          <CheckoutOrders
            paymentSummary={paymentSummary}
            addressToDeliver={addressToDeliver}
          />
          <CouponSection
            updatePaymentSummaryWithOverLayLoading={
              updatePaymentSummaryWithOverLayLoading
            }
            setOverLayLoading={setOverLayLoading}
            isCouponApplied={isCouponApplied}
            setIsCouponApplied={setIsCouponApplied}
            setAppliedCouponAmount={setAppliedCouponAmount}
            paymentSummary={paymentSummary}
            setPaymentSummary={setPaymentSummary}
          />
          <SubtotalComponent
            cashbackUsed={cashBackUsed}
            isCashbackUsed={isCashBackUsed}
            setIsCashbackUsed={setIsCashbackUsed}
            overLayLoading={overLayLoading}
            paymentSummary={paymentSummary}
            isPaymentSummaryLoading={isPaymentSummaryLoading}
            userAddress={addressToDeliver}
            addressToDeliver={addressToDeliver}
            isCouponApplied={isCouponApplied}
            appliedCouponAmount={appliedCouponAmount}
          />

          {isCashBackUsed && cashBackUsed === paymentSummary?.totalPayable ? (
            <>
              <PlaceOrder
                checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry={
                  checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry
                }
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                userNote={userNote}
                setUserNote={setUserNote}
                loading={loading}
                isCashBackUsed={isCashBackUsed}
                handleSubmit={placeOrder}
                isTermsAgreed={isTermsAgreed}
                setIsTermsAgreed={setIsTermsAgreed}
              />
            </>
          ) : (
            <>
              {sessionStorage.getItem("guestLogin") &&
                !auth.currentUser?.uid &&
                addressToDeliver?.address &&
                addressToDeliver?.city &&
                addressToDeliver?.state &&
                addressToDeliver?.country &&
                addressToDeliver?.name && (
                  <>
                    <>
                      {!!paymentSummary ? (
                        <StripeWrapper
                          isCouponApplied={isCouponApplied}
                          cashbackUsed={cashBackUsed}
                          paymentSummary={paymentSummary}
                          addressToDeliver={addressToDeliver}
                          stripeData={{
                            currency: currency,
                            amount: isCashBackUsed
                              ? (paymentSummary?.totalPayable - cashBackUsed) *
                                currRate
                              : paymentSummary?.totalPayable * currRate,
                            user: {
                              name: addressToDeliver?.name,
                              address: addressToDeliver,
                              phone: userData?.phoneNo,
                            },
                          }}
                        >
                          <Paymentmethods
                            checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry={
                              checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry
                            }
                            userNote={userNote}
                            setUserNote={setUserNote}
                            setLoading={setLoading}
                            loading={loading}
                            isTermsAgreed={isTermsAgreed}
                            setIsTermsAgreed={setIsTermsAgreed}
                            paymentSummary={paymentSummary}
                            placeOrder={placeOrder}
                            updatePaymentMethod={setSelectedPaymentMethod}
                            addressToDeliver={addressToDeliver}
                          />
                        </StripeWrapper>
                      ) : (
                        <Paymentmethods
                          checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry={
                            checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry
                          }
                          userNote={userNote}
                          setUserNote={setUserNote}
                          loading={loading}
                          setLoading={setLoading}
                          isTermsAgreed={isTermsAgreed}
                          setIsTermsAgreed={setIsTermsAgreed}
                          paymentSummary={paymentSummary}
                          placeOrder={placeOrder}
                          updatePaymentMethod={setSelectedPaymentMethod}
                          addressToDeliver={addressToDeliver}
                        />
                      )}
                    </>
                  </>
                )}
              {!sessionStorage.getItem("guestLogin") &&
                auth.currentUser?.uid && (
                  <>
                    {!!paymentSummary ? (
                      <StripeWrapper
                        addressToDeliver={addressToDeliver}
                        isCouponApplied={isCouponApplied}
                        cashbackUsed={cashBackUsed}
                        paymentSummary={paymentSummary}
                        stripeData={{
                          currency: currency,
                          amount: isCashBackUsed
                            ? (paymentSummary?.totalPayable - cashBackUsed) *
                              currRate
                            : paymentSummary?.totalPayable * currRate,
                          user: {
                            name: userData?.name,
                            address: addressToDeliver,
                            phone: userData?.phoneNo,
                          },
                        }}
                      >
                        <Paymentmethods
                          checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry={
                            checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry
                          }
                          userNote={userNote}
                          setUserNote={setUserNote}
                          setLoading={setLoading}
                          loading={loading}
                          isTermsAgreed={isTermsAgreed}
                          setIsTermsAgreed={setIsTermsAgreed}
                          paymentSummary={paymentSummary}
                          placeOrder={placeOrder}
                          updatePaymentMethod={setSelectedPaymentMethod}
                          addressToDeliver={addressToDeliver}
                        />
                      </StripeWrapper>
                    ) : (
                      <Paymentmethods
                        checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry={
                          checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry
                        }
                        userNote={userNote}
                        setUserNote={setUserNote}
                        loading={loading}
                        setLoading={setLoading}
                        isTermsAgreed={isTermsAgreed}
                        setIsTermsAgreed={setIsTermsAgreed}
                        paymentSummary={paymentSummary}
                        placeOrder={placeOrder}
                        updatePaymentMethod={setSelectedPaymentMethod}
                        addressToDeliver={addressToDeliver}
                      />
                    )}
                  </>
                )}
            </>
          )}

          <p className="text-xs md:text-sm ">
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes described
            in our privacy policy.
          </p>

          <div className="w-full  ">
            <Image
              src={cards}
              alt="payment cards"
              height={1000}
              width={1000} // style={{ aspectRatio: "auto", width: "100px", height: "auto" }}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
