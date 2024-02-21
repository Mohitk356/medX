"use client";
import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment, useRef, useState } from "react";
import Image from "next/image";
import FlatIcon from "../../components/flatIcon/flatIcon";
import { constant } from "../../utils/constants";
import { toast } from "react-toastify";
import { uploadFile } from "../../utils/databaseService";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { CircularProgress } from "@mui/material";

const inputs = [
  {
    type: "text",
    title: "Candidate Full Name*",
    name: "name",
  },
  {
    type: "text",
    title: "Candidate Mobile Number (UAE Only)*",
    name: "phoneNo",
  },
  {
    type: "text",
    title: "Candidate Email Address*",
    name: "email",
  },
  {
    type: "select",
    select: "designation",
    title: "Designation Applying for:*",
    name: "designation",
  },
  {
    type: "select",
    name: "experience",
    select: "experience",
    title: "Total Work Experience in UAE:*",
  },
  {
    type: "file",
    name: "resume",
    title: "Upload CV*",
  },
  {
    type: "text-area",
    name: "brief",
    title: "Brief Description About Your Self",
  },
];

const Careers = () => {
  const [state, setState] = useState({
    brief: "",
    resumeUrl: "",
    experience: "",
    designation: "",
    email: "",
    phoneNo: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);

  function setSelected(props, item) {
    setState({ ...state, [item?.name]: props });
  }

  function handleChange(name, value) {
    setState({ ...state, [name]: value });
  }

  function handleUploadResume(name, files) {
    if (files && files.length !== 0) {
      setResume(files[0]);
    } else {
      toast.error("Upload Resume");
      setResume(null);
    }
  }

  async function handleSubmit() {
    const { brief, designation, email, experience, name, phoneNo, resumeUrl } =
      state;
    if (!designation || !email || !experience || !name || !phoneNo)
      return toast.error("Enter Details Correctly");

    if (!resume) return toast.error("Upload Resume");
    setLoading(true);

    const url = await uploadFile({
      file: resume,
      email: email,
      refCollection: "careers",
    });

    let data = {
      brief,
      designation,
      email,
      experience,
      name,
      phoneNo,
      resumeUrl: url,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "careers"), data);
      setState({
        brief: "",
        resumeUrl: "",
        experience: "",
        designation: "",
        email: "",
        phoneNo: "",
        name: "",
      });
      setLoading(false);

      toast.success("Application submitted.");
    } catch (error) {
      console.log(error);
      setLoading(false);

      toast.error("Sonething went wrong. Try again later");
    }
  }

  function renderFields(item) {
    switch (item?.type) {
      case "text":
        return (
          <div className="relative w-full h-full flex items-center border border-gray-300  rounded-lg">
            <div className="flex w-full">
              <input
                type={item.type}
                name={item.name}
                id={item?.name}
                // value={state[item?.name]}
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
                //   value={searchQuery}
                className="py-2 px-2 rounded-lg w-full outline-none focus:border-none"
                //   onChange={(e) => {
                //     setSearchQuery(e.target.value);
                //   }}
              />
            </div>
          </div>
        );

      case "select":
        return (
          <div>
            <div className="flex-1">
              <Listbox
                value={
                  item?.select === "experience"
                    ? state.experience
                    : state.designation
                }
                onChange={(prop) => setSelected(prop, item)}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default  bg-white py-3 rounded-md  pl-3 pr-10 text-left border border-gray-300 focus:outline-none sm:text-sm">
                    <span className="block truncate ">
                      {(item?.select === "experience"
                        ? state.experience
                        : state.designation) || "--Please choose an option--"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <FlatIcon className={`flaticon-arrow-down-2`} />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="z-50 absolute px-4 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {(item?.select === "experience"
                        ? constant?.experience
                        : constant.designation
                      ).map((intake, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-2 pr-4 border-b border-gray-300 ${
                              active ? " text-primary" : "text-gray-900"
                            }`
                          }
                          value={intake}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {intake}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 right-0 flex items-center pl-3 text-primary">
                                  <FlatIcon className={`flaticon-check`} />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        );

      case "text-area":
        return (
          <div className="relative w-full h-full flex items-center border border-gray-300  rounded-lg">
            <div className="flex w-full">
              <textarea
                name={item?.name}
                value={state.brief}
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
                id=""
                rows={5}
                className="w-full py-2 px-2 rounded-lg outline-none focus:border-none"
              />
            </div>
          </div>
        );

      case "file":
        return (
          <div className="relative w-full h-full flex items-center border border-gray-300  rounded-lg">
            <div className="flex w-full">
              <input
                type={item.type}
                name={item.name}
                id={item?.name}
                onChange={(e) => {
                  handleUploadResume(e.target.name, e.target.files);
                }}
                //   value={searchQuery}
                className="py-2 px-2 rounded-lg w-full outline-none focus:border-none"
                //   onChange={(e) => {
                //     setSearchQuery(e.target.value);
                //   }}
              />
            </div>
          </div>
        );

      default:
        return <></>;
    }
  }

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="w-full relative">
          <Image
            src={require("../../images/career.png")}
            alt="career"
            width={1000}
            height={1000}
            className="w-full h-full object-fill"
          />
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center gap-1 lg:gap-3 px-body">
            <h1 className=" text-xl md:text-2xl lg:text-6xl font-medium text-white">
              Careers
            </h1>
            <p className="text-sm md:text-lg lg:text-4xl font-medium text-white">
              Our happiness team is always here to assist.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-body py-6">
          {inputs.map((item) => {
            return (
              <div key={item?.name} className="w-full flex flex-col gap-1">
                <p>{item?.title}</p>
                {renderFields(item)}
              </div>
            );
          })}
        </div>
        <div className="px-body flex justify-center items-center w-fit mb-5 rounded-md">
          <button
            onClick={handleSubmit}
            className="flex-1 flex justify-center items-center py-2 px-10 font-semibold rounded-md bg-black text-white hover:bg-white hover:text-black border border-black"
          >
            {loading ? (
              <CircularProgress className="!text-white" size={25} />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Careers;
