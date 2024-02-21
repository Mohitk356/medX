"use client";
import React, { Fragment, useState } from "react";
import FlatIcon from "../../components/flatIcon/flatIcon";
import { Listbox, Transition } from "@headlessui/react";
import { constant } from "../../utils/constants";
import { toast } from "react-toastify";
import { uploadFile } from "../../utils/databaseService";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { CircularProgress } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";

const FileUpload = ({ setChange, value, title, name }: any) => {
  return (
    <div className="flex gap-2 md:items-center flex-col md:flex-row w-full md:w-[50%]">
      <p className="w-full">{title}</p>
      <div className="py-0 px-0 md:py-2 md:px-2 bg-gray-50 border-2 border-gray-300 w-[70%] md:w-full ">
        <input
          type="file"
          className="w-[100%]"
          onChange={(e) => {
            setChange(e.target.files);
          }}
        />
      </div>
    </div>
  );
};
const TextField = ({
  onChange = null,
  value = null,
  title,
  isFullWidth,
  name = "",
}: any) => {
  return (
    <div
      className={` ${isFullWidth ? "w-full " : "w-[50%]"} flex flex-col gap-1`}
    >
      <p className="text-sm md:text-base">{title}</p>
      <div
        className={`relative w-full  h-full flex items-center border border-gray-300  rounded-sm`}
      >
        <div className="flex w-full">
          <input
            className="md:py-2 md:px-2 w-full select-none outline-none"
            type="text"
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const points = [
  "Fill your name & mobile number",
  "Upload your Prescription",
  "Upload your Emirates ID (Front & Back)",
];

const initial = {
  city: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNo: "",
  buildingName: "",
  flatNo: "",
  fullAddress: "",
  prescription: "",
  emiratesIdFront: "",
  emiratesIdBack: "",
  insuraneCardFront: "",
  insuranceCardBack: "",
  eRxNo: "",
};

const UploadPrescription = () => {
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  const [state, setState] = useState(initial);
  const [prescription, setPrescription] = useState(null);
  const [emiratedFront, setEmiratesFront] = useState(null);
  const [emiratedBack, setEmiratesBack] = useState(null);
  const [insuranceBack, setInsuranceBack] = useState(null);
  const [insuranceFront, setInsuranceFront] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTextChange = (name, value) => {
    setState({ ...state, [name]: value });
  };

  async function handleSubmit() {
    const {
      buildingName,
      city,
      eRxNo,
      email,
      firstName,
      flatNo,
      fullAddress,
      lastName,
      phoneNo,
    } = state;

    if (
      !buildingName ||
      !city ||
      !email ||
      !firstName ||
      !flatNo ||
      !fullAddress ||
      !lastName ||
      !phoneNo
    ) {
      toast.error("Enter Details Correctly.");
      return;
    }

    if (!prescription || !emiratedFront || !emiratedBack) {
      toast.error("Upload all documents");
      return;
    }

    let arr = [
      prescription,
      emiratedFront,
      emiratedBack,
      insuranceFront,
      insuranceBack,
    ];

    let urls = [];

    setLoading(true);

    for (const file of arr) {
      try {
        if (file && file?.length !== 0) {
          let url = await uploadFile({
            file: file[0],
            refCollection: "prescription",
            email: email,
          });
          urls.push(url);
        } else {
          urls?.push("");
        }
      } catch (error) {
        console.log(error);

        setLoading(false);

        toast.error("Sonething went wrong. Try again later");
        return;
      }
    }

    let data = {
      buildingName,
      city,
      eRxNo,
      email,
      firstName,
      flatNo,
      fullAddress,
      lastName,
      phoneNo,
      prescription: urls[0],
      emiratesIdFront: urls[1],
      emiratesIdBack: urls[2],
      insuraneCardFront: urls[3],
      insuranceCardBack: urls[4],
      createdAt: new Date(),
    };
    try {
      await addDoc(collection(db, "prescriptions"), data);
      setState(initial);
      setLoading(false);

      toast.success("Prescription uploaded.");
    } catch (error) {
      console.log(error);
      setLoading(false);

      toast.error("Sonething went wrong. Try again later");
    }
  }

  return (
    <div className="flex flex-col px-body my-6">
      <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">
        Upload Prescription
      </h1>

      <div className="flex flex-col my-6 gap-2 justify-center">
        {points.map((val, idx) => {
          return (
            <div key={idx} className="flex gap-2">
              <div className="bg-primary rounded-full h-[15px] w-[15px] md:h-[20px] md:w-[20px] flex flex-col items-center justify-center  md:p-[3px]">
                <FlatIcon className="flaticon-check text-white text-xs"></FlatIcon>
              </div>
              <p className="text-base sm:text-lg md:text-xl">{val}</p>
            </div>
          );
        })}
      </div>

      <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">
        Your medicines will reach you shortly.
      </h1>
      <div className="my-3 shadow-centeredShadow px-[1%] py-[2%] flex flex-col gap-4">
        <div className="flex w-full flex-1 gap-4">
          <TextField
            onChange={handleTextChange}
            value={state.firstName}
            title={"First Name*"}
            name="firstName"
          />
          <TextField
            onChange={handleTextChange}
            value={state.lastName}
            name="lastName"
            title={"Last Name*"}
          />
        </div>
        <div className="flex w-full flex-1 gap-4">
          <TextField
            onChange={handleTextChange}
            value={state.email}
            name="email"
            title={"Email Address*"}
          />
          <TextField
            onChange={handleTextChange}
            value={state.phoneNo}
            name="phoneNo"
            title={"Mobile No*"}
          />
        </div>
        <div className="flex w-full flex-1 gap-4">
          <TextField
            onChange={handleTextChange}
            value={state.buildingName}
            name="buildingName"
            title={"Building Name / Makani Name*"}
          />
          <TextField
            onChange={handleTextChange}
            value={state.flatNo}
            name="flatNo"
            title={"Flat No / Villa No*"}
          />
        </div>
        <div className="flex w-full flex-1 gap-4">
          <TextField
            title={"Full Address*"}
            onChange={handleTextChange}
            value={state.fullAddress}
            name="fullAddress"
            isFullWidth
          />
          {/* <TextField onChange={() => {}} title={"Flat No / Villa No*"} /> */}
        </div>
        <div className="flex w-full flex-col gap-1">
          {currency === "AED" && <p>City*</p>}
          {currency === "AED" ? (
            <Listbox
              value={state.city}
              onChange={(prop) => setState({ ...state, city: prop })}
            >
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default  bg-white md:py-3 rounded-md  md:pl-3 md:pr-10 text-left border border-gray-300 focus:outline-none sm:text-sm">
                  <span className="block truncate ">
                    {state.city || "--Please choose an option--"}
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
                    {constant.cities.map((intake, personIdx) => (
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
          ) : (
            <TextField
              title={"City*"}
              onChange={handleTextChange}
              value={state.city}
              name="city"
              isFullWidth
            />
          )}
        </div>

        <div className="flex w-full flex-1 gap-4">
          <FileUpload
            title={"Upload Prescription*"}
            setChange={setPrescription}
          />
          {/* <TextField onChange={() => {}} title={"Flat No / Villa No*"} /> */}
        </div>

        <div className="flex w-full flex-1 ">
          <div className={` ${"w-full "} flex flex-col gap-1`}>
            <p>eRx No (Optional)</p>
            <div
              className={`relative w-full  h-full flex items-center border border-gray-300  rounded-sm`}
            >
              <div className="flex w-full">
                <input
                  className="md:py-2 md:px-2 w-full select-none outline-none"
                  type="text"
                  value={state.eRxNo}
                  name="eRxNo"
                  onChange={(e) =>
                    handleTextChange(e.target.name, e.target.value)
                  }
                  //    onChange={(e) => onChange(e)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-1 gap-4">
          <FileUpload
            setChange={setEmiratesFront}
            title={"Upload Emirates ID (Front)* "}
          />
          {/* <TextField onChange={() => {}} title={"Flat No / Villa No*"} /> */}
        </div>
        <div className="flex w-full flex-1 gap-4">
          <FileUpload
            setChange={setEmiratesBack}
            title={"Upload Emirates ID (Back)*"}
          />
          {/* <TextField onChange={() => {}} title={"Flat No / Villa No*"} /> */}
        </div>
        <div className="flex w-full flex-1 gap-4">
          <FileUpload
            setChange={setInsuranceFront}
            title={"Insurance Card (Front) (Optional) "}
          />
          {/* <TextField onChange={() => {}} title={"Flat No / Villa No*"} /> */}
        </div>
        <div className="flex w-full flex-1 gap-4">
          <FileUpload
            setChange={setInsuranceBack}
            title={"Insurance Card (Back) (Optional) "}
          />
          {/* <TextField onChange={() => {}} title={"Flat No / Villa No*"} /> */}
        </div>
        <div className="flex flex-col justify-center items-start w-fit mb-5 gap-2 mt-3 rounded-md">
          <button
            onClick={handleSubmit}
            className="flex-1 flex justify-center items-center py-1 px-5 md:py-2 md:px-10 font-semibold rounded-md bg-primary text-white text-sm sm:text-base  md:text-lg hover:bg-white hover:text-primary border border-primary"
          >
            {loading ? (
              <CircularProgress
                className="!text-white hover:text-primary"
                size={25}
              />
            ) : (
              "SEND ORDER"
            )}
          </button>
          <p className="mt-1 text-xs md:text-sm font-semibold">
            <span className="text-primary">Note*:</span> Before Order Submission
            Please verify your Phone Number and Upload file in Pdf or Txt File
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPrescription;
