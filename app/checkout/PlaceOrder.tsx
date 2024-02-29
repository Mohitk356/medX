import { CircularProgress } from "@mui/material";
import Link from "next/link";

export default function PlaceOrder({
  handleSubmit,
  setIsTermsAgreed,
  userNote,
  checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry,
  setUserNote,
  isTermsAgreed,
  setSelectedPaymentMethod = null,
  isCashBackUsed = false,
  loading,
}) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="w-full border border-gray-300 rounded-md">
        <input
          type="text"
          value={userNote}
          onChange={(e) => {
            setUserNote(e.target.value);
          }}
          placeholder="Add note"
          className="w-full rounded-md select-none outline-none py-2 px-3"
        />
      </div>
      <div className="w-full flex gap-2 items-center justify-between ">
        <div className="flex gap-2">
          <input
            type="checkbox"
            name=""
            id=""
            value={isTermsAgreed}
            onChange={(e) => {
              setIsTermsAgreed(e.target.checked);
            }}
          />
          <span className=" text-[10px] sm:text-xs md:text-sm ">
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
        onClick={() => {
          if (
            checkIfThereIsAnyProductWhichIsNotDeliverableToSelectedCountry()
          ) {
            return;
          }

          if (isCashBackUsed && setSelectedPaymentMethod) {
            setSelectedPaymentMethod("cash");
          }
          handleSubmit({ isCod: true });
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
  );
}
