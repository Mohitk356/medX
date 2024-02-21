"use client";
import { Disclosure } from "@headlessui/react";
import React from "react";
import FlatIcon from "../../components/flatIcon/flatIcon";

const orders = [
  {
    ques: "How long does it take for me to receive my order?",
    ans: "All orders within the Dubai & Sharjah are delivered within 24 Hours or maximum by next day; Orders for all other emirates (Abu Dhabi, Ajman, Fujairah, Ras Al Khaimah & Umm Al Quwain) will be shipped within 48 Hours.",
  },
  {
    ques: "How do I create an account?",
    ans: "EXMB Team",
  },
  {
    ques: "How do I change my shipping address?",
    ans: "Contact us at 800-700-500 or email us at info@medxpharmacy.com with your Order details.",
  },
  {
    ques: "How do I track the status of my order?",
    ans: "To track your order please enter your Order ID & Registered Email Address in the ‘Track Your Order’ page and press the ‘Track’ button.",
  },
  {
    ques: "Do you charge sales tax?",
    ans: "Yes, we charge 5% VAT for all taxable items as per UAE government law.",
  },
  {
    ques: "Will my items come in one package?",
    ans: "Yes, you will receive all the items in an order in one package. This may or not happen depending on the size or availability of the item.",
  },
];

const exchange = [
  {
    ques: "What is your returns policy?",
    ans: "We have 5 days return policy from the date of receiving the Product(s) if you are not happy with the Products ordered from www.medxpharmacy.com.Please return & refund policy for more details.",
  },
  {
    ques: "Can medicines be returned or exchanged?",
    ans: "Medicines once sold cannot be Exchanged or Refunded as per MOH Regulations.",
  },
  {
    ques: "I received the wrong item or My order arrived damaged",
    ans: "Please contact us at 800-700-500 or email us at info@medxpharmacy.com with your Order details, so that our team will check and get back to you.",
  },
  {
    ques: "How do I receive customer support?",
    ans: "Reach out to us through website www.medxpharmacy.com, Toll Free No: 800-700-500 or email us at info@medxpharmacy.com.",
  },
  {
    ques: "Can I change or cancel an order after I've submitted it?",
    ans: "Yes, you can cancel the order directly by contacting us at 800-700-500",
  },
];

const CustomerHelp = () => {
  return (
    <div className="flex md:flex-row flex-col gap-6 px-body my-6">
      <div className="flex-1 flex flex-col items-center ">
        <h2 className="text-center font-semibold text-gray-700 text-lg md:text-xl">
          Common purchase queries answered
        </h2>
        <h1 className="font-semibold text-xl md:text-2xl">Orders and Shipping</h1>
        <div className="w-full mt-2 border border-gray-300 rounded-md flex flex-col gap-2">
          {orders.map((item, idx) => {
            return (
              <Disclosure key={idx}>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={`flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm md:text-base font-medium focus:outline-none focus-visible:ring border-b border-gray-300 ${
                        open ? "font-semibold" : ""
                      } `}
                    >
                      <span className="text:sm md:text-base">{item.ques}</span>
                      <FlatIcon
                        className={` flaticon-arrow-down-2 ${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-primary`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="border-b border-gray-300 px-4 pt-0 pb-2 text-sm md:text-base text-gray-500">
                      {item.ans}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            );
          })}
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center ">
        <h2 className="text-center font-semibold text-gray-700 text-lg md:text-xl">
          If you need to swap an item
        </h2>
        <h1 className="font-semibold text-xl md:text-2xl">Returns and Exchanges</h1>
        <div className="w-full mt-2 border border-gray-300 rounded-md flex flex-col gap-2">
          {exchange.map((item, idx) => {
            return (
              <Disclosure key={idx}>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={`flex w-full justify-between px-4 py-2 text-left text-sm md:text-base font-medium focus:outline-none focus-visible:ring border-b border-gray-300 ${
                        open ? "font-semibold" : ""
                      } `}
                    >
                      <span>{item.ques}</span>
                      <FlatIcon
                        className={` flaticon-arrow-down-2 ${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-primary`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 border-b border-gray-300 pt-0 pb-2 text-sm md:text-base text-gray-500">
                      {item.ans}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerHelp;
