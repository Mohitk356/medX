"use client";

import validator from "validator";
import React, { useState } from "react";

import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { CircularProgress } from "@mui/material";
// import { handleContactUsSubmit } from "@/utils/databaseService";

const ContactForm = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = ({ name, value }: any) => {
    setState((val) => {
      return { ...val, [name]: value };
    });
  };

  const handleSubmit = async () => {
    if (!state.name || !state.email || !state.subject) {
      toast("Enter details correctly", { type: "error" });
      return;
    }

    if (!validator.isEmail(state.email)) {
      toast("Incorrect Email.", { type: "error" });
      return;
    }

    setLoading(true);

    const data = {
      createdAt: new Date(),
      email: state.email,
      message: state.message,
      name: state.name,
      subject: state.subject,
    };

    try {
      await addDoc(collection(db, "contact-us"), data);
      setState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setLoading(false);
      toast.success("Message Sent.");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong.");
    }

    // const res: boolean = await handleContactUsSubmit(data);
    // if (res) {
    //   setState({
    //     email: "",
    //     message: "",
    //     name: "",
    //     subject: "",

    //   });
    //   setLoading(false);
    //   toast("Thank you for contacting us", { type: "success" });
    //   return;
    // } else {
    //   toast("Something went wrong.", { type: "error" });
    //   return;
    // }
  };

  return (
    <div className="flex flex-col gap-2 mt-12">
      <div>
        <h1 className="text-base font-normal">Your name*</h1>
        <div className=" w-[100%] border-[0.5px] border-[#E3E3E3] rounded-md ">
          <input
            type="text"
            name="name"
            onChange={(e) => {
              handleChange({ name: e.target.name, value: e.target.value });
            }}
            value={state.name}
            className=" w-full h-6 sm:h-8 md:h-10 rounded-md py-4 px-4"
          />
        </div>
      </div>

      <div>
        <h1 className="text-base font-normal">Your email*</h1>
        <div className=" w-[100%] border-[0.5px] border-[#E3E3E3] rounded-md ">
          <input
            type="email"
            name="email"
            onChange={(e) => {
              handleChange({ name: e.target.name, value: e.target.value });
            }}
            value={state.email}
            className=" w-full h-6 sm:h-8 md:h-10  rounded-md py-4 px-4"
          />
        </div>
      </div>

      <div>
        <h1 className="text-base font-normal">Subject*</h1>
        <div className=" w-[100%] border-[0.5px] border-[#E3E3E3]  rounded-md">
          <input
            type="text"
            name="subject"
            onChange={(e) => {
              handleChange({ name: e.target.name, value: e.target.value });
            }}
            value={state.subject}
            className="w-full h-6 sm:h-8 md:h-10  rounded-md py-4 px-4"
          />
        </div>
      </div>

      <div>
        <h1 className="text-base font-normal">Your message (optional)</h1>
        <div className="border-[0.5px] border-[#E3E3E3]  rounded-md textarea-container ">
          <textarea
            rows={5}
            name="message"
            onChange={(e) => {
              handleChange({ name: e.target.name, value: e.target.value });
            }}
            value={state.message}
            className="w-full rounded-md py-4 px-4"
          />
        </div>
      </div>

      <div>
        <div
          onClick={handleSubmit}
          //   isLoading={loading}
          className="w-[70px] h-[35px] sm:w-[90px] sm:h-[40px]  md:w-[110px] md:h-[45px]  lg:w-[130px] lg:h-[50px] cursor-pointer bg-[#ED1B24]  rounded border-2 hover:cursor-pointer  border-[#ED1B24] hover:bg-white "
        >
          <h1 className="w-full h-full text-sm sm:text-base md:text-lg text-white font-normal hover:text-[#ED1B24] flex justify-center items-center">
            {loading ? (
              <CircularProgress
                className="!text-white"
                size={25}
              ></CircularProgress>
            ) : (
              "SUBMIT"
            )}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
