"use client";
import React, { Fragment, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { fetchAllBrands, uploadFile } from "../../utils/databaseService";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { CircularProgress } from "@mui/material";
import { Listbox, Transition } from "@headlessui/react";
import FlatIcon from "../../components/flatIcon/flatIcon";
import { Multiselect } from "react-widgets";
import { useQuery } from "@tanstack/react-query";
const inputs = [
  {
    type: "text",
    title: "Brand Name*",
    name: "brandName",
  },
  {
    type: "text",
    title: "Representative or POC Name*",
    name: "name",
  },
  {
    type: "text",
    title: "Representative or POC Mobile Number*",
    name: "phoneNo",
  },
  {
    type: "text",
    title: "Representative or POC Email Address*",
    name: "email",
  },
  {
    type: "file",
    name: "profileAttachment",
    title: "Corporate Profile Attachment*",
  },
  {
    type: "multiSelect",
    name: "interestedBrands",
    title: "Brands Interested*",
  },
  {
    type: "select",
    name: "businessType",
    title: "Business Type*",
  },
  {
    type: "text-area",
    name: "comments",
    title: "Additional Comments",
  },
];

const brands = ["Raw Nutrition", "Revive", "QNT", "Biotech USA", "Fitmaxx"];

const BecomeAPartner = () => {
  const [state, setState] = useState({
    brandName: "",
    profileAttachment: "",
    comments: "",
    email: "",
    phoneNo: "",
    name: "",
    interestedBrands: [],
    businessType: "",
  });

  const [isOtherBrand, setIsOtherBrand] = useState(false);
  const [otherInterestedBrand, setOtherInterestedBrand] = useState("");

  const fileref: any = useRef();

  // const { data: brands } = useQuery({
  //   queryKey: ["allBrands"],
  //   queryFn: fetchAllBrands,
  // });

  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);

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
    const {
      brandName = "",
      comments = "",
      email = "",
      phoneNo = "",
      name = "",
      businessType = "",
      interestedBrands = [],
    } = state;

    if (
      !brandName ||
      !name ||
      !email ||
      !phoneNo ||
      !businessType ||
      !interestedBrands
    )
      return toast.error("Enter Details Correctly");

    if (!resume) return toast.error("Upload Profile Attachment");

    setLoading(true);

    const url = await uploadFile({
      file: resume,
      email: email,
      refCollection: "become-a-partner",
    });

    let data = {
      comments,
      email,
      brandName,
      profileAttachment: url,
      name,
      phoneNo,
      createdAt: new Date(),
      businessType: state.businessType,
      interestedBrands: state.interestedBrands,
    };

    if (isOtherBrand) {
      data.interestedBrands?.push(otherInterestedBrand);
    }

    try {
      await addDoc(collection(db, "become-a-partner"), data);
      setState({
        brandName: "",
        profileAttachment: "",
        comments: "",
        email: "",
        interestedBrands: [],
        phoneNo: "",
        businessType: "",
        name: "",
      });
      if (fileref.current) {
        fileref.current.value = "";
      }
      setLoading(false);

      toast.success("Application submitted.");
    } catch (error) {
      console.log(error);
      setLoading(false);

      toast.error("Sonething went wrong. Try again later");
    }
  }

  function setSelected(props, item) {
    setState({ ...state, [item?.name]: props });
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
                value={state[item?.name]}
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

      case "text-area":
        return (
          <div className="relative w-full h-full flex items-center border border-gray-300  rounded-lg">
            <div className="flex w-full">
              <textarea
                name={item?.name}
                value={state.comments}
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
                ref={fileref}
                id={item?.name}
                // value={state[item?.name]}
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

      case "select":
        return (
          <div className="relative w-full h-full flex items-center -mt-1  rounded-lg">
            <Listbox
              value={state.businessType}
              onChange={(prop) => setSelected(prop, item)}
            >
              <div className="relative mt-1 w-full">
                <Listbox.Button className="relative w-full cursor-default  bg-white py-3 rounded-md  pl-3 pr-10 text-left border border-gray-300 focus:outline-none sm:text-sm">
                  <span className="block truncate ">
                    {state.businessType || "--Please choose an option--"}
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
                    <Listbox.Option
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-2 pr-4 border-b border-gray-300 ${
                          active ? " text-primary" : "text-gray-900"
                        }`
                      }
                      value={"Wholesale"}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            Wholesale
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 right-0 flex items-center pl-3 text-primary">
                              <FlatIcon className={`flaticon-check`} />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-2 pr-4  ${
                          active ? " text-primary" : "text-gray-900"
                        }`
                      }
                      value={"Retail"}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            Retail
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 right-0 flex items-center pl-3 text-primary">
                              <FlatIcon className={`flaticon-check`} />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        );

      case "multiSelect":
        return (
          <div className="flex flex-col gap-2">
            {brands?.map((brand) => {
              return (
                <div className="flex gap-2 items-center" key={brand}>
                  <input
                    type="radio"
                    name=""
                    value={brand}
                    checked={state.interestedBrands.includes(brand)}
                    id=""
                    onClick={() => {
                      if (state.interestedBrands.includes(brand)) {
                        let filtered = state.interestedBrands?.filter(
                          (b) => b !== brand
                        );
                        console.log("STATAE", { filtered });

                        setState({
                          ...state,
                          interestedBrands: filtered,
                        });
                      } else {
                        let added = state.interestedBrands;
                        added.push(brand);
                        setState({
                          ...state,
                          interestedBrands: added,
                        });
                      }
                    }}
                  />
                  <p>{brand}</p>
                </div>
              );
            })}
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                name=""
                value="Others"
                checked={isOtherBrand}
                id=""
                onClick={() => {
                  setIsOtherBrand(!isOtherBrand);
                }}
              />
              <p>Other</p>
              <div className="border-b border-gray-400 ">
                <input
                  type="text"
                  className="outline-none ease-in"
                  value={otherInterestedBrand}
                  onChange={(e) => {
                    if (isOtherBrand) {
                      setOtherInterestedBrand(e.target.value);
                      // setState({
                      //   ...state,
                      //   interestedBrands: [e.target.value],
                      // });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        );

      // case "multiSelect":
      //   return (
      //     <>
      //       <Multiselect
      //         disabled={!brands}
      //         dataKey="id"
      //         textField="name"
      //         onChange={(data) => {
      //           console.log(data);
      //           setState({ ...state, interestedBrands: data });
      //         }}
      //         value={state.interestedBrands}
      //         // defaultValue={}
      //         data={brands ? [...brands] : []}
      //       />
      //     </>
      //   );
      default:
        return <></>;
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full relative">
        <Image
          src={require("../../images/career.png")}
          alt="career"
          width={1000}
          height={1000}
          className="w-full h-full object-fill"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center gap-3 px-body">
          <h1 className=" text-xl md:text-2xl lg:text-6xl font-medium text-white">
            Become a Partner
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
  );
};

export default BecomeAPartner;
