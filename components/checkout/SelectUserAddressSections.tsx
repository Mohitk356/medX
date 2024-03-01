"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addressFromPinCode,
  getCountries,
  updateDefaultAddress,
} from "../../utils/databaseService";

import { Fragment, useEffect, useState } from "react";
import { initialAddress, validateEmail } from "../../utils/utilities";
import Modal from "../Modal/modal";
import { Listbox, Transition } from "@headlessui/react";
import FlatIcon from "../flatIcon/flatIcon";
import { allCountries, constant } from "../../utils/constants";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

export default function SelectUserAddressSection(props) {
  const { data: allowedCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
    keepPreviousData: true,
  });

  const [isAddressUpdating, setIsAddressUpdating] = useState(false);
  const queryClient = useQueryClient();
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);

  const [editModalState, setEditModalState] = useState(props?.userAddress);

  const handleChange = (name, value) => {
    console.log({ name, value });

    setEditModalState((val) => {
      return { ...val, [name]: value };
    });
  };

  useEffect(() => {
    setEditModalState(props?.userAddress);
  }, [props?.userAddress]);

  return (
    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 ">
      <div className=" rounded-br-[10px] border border-primary mt-4 flex justify-between  px-4 py-4  shadow-md">
        <div className="flex-1 flex flex-col gap-1 md:gap-2">
          <p className="text-lg font-medium">Shipping Address</p>
          <div className="flex flex-col gap-1 md:gap-2">
            <p className="font-medium">
              Name:{" "}
              <span className="text-gray-500">
                {props.userData?.defaultAddress?.name}
              </span>
            </p>
            <p className="font-medium">
              Address:{" "}
              <span className="text-gray-500">
                {props.userData?.defaultAddress?.address}
              </span>
            </p>
            <p className="font-medium">
              Phone:{" "}
              <span className="text-gray-500">
                {`${props.userData?.defaultAddress?.ccode || ""} ${props.userData?.defaultAddress?.phoneNo
                  }`}
              </span>
            </p>
            <p className="font-medium">
              City:{" "}
              <span className="text-gray-500">
                {props.userData?.defaultAddress?.state}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 md:gap-2 justify-center">
          {props?.userAddresses?.length > 1 && (
            <button
              onClick={() => {
                props.setSelectAddressModal(true);
              }}
              className=" bg-primary text-white py-1 md:py-1 px-1 md:px-2 hover:bg-white hover:text-black cursor-pointer rounded-md border border-primary h-[30px] sm:h-[40px] md:h-[40px]"
            >
              Change Address
            </button>
          )}
          {/* <button
            className=" bg-primary text-white py-1 md:py-1 px-1 md:px-2 hover:bg-white hover:text-black cursor-pointer rounded-md border border-primary h-[30px] sm:h-[40px] md:h-[40px]"
            onClick={() => {
              props.setUserAddress(initialAddress);
              props.setIsNewAddress(true);
            }}
          >
            Add New Address
          </button> */}
          <button
            className=" bg-primary text-white py-1 md:py-1 px-1 md:px-2 hover:bg-white hover:text-black cursor-pointer rounded-md border border-primary h-[30px] sm:h-[40px] md:h-[40px]"
            onClick={() => {
              setIsEditAddressOpen(true);
              // props.setUserAddress(initialAddress);
              // props.setIsNewAddress(true);
            }}
          >
            Edit Address
          </button>
        </div>
      </div>

      <Modal isOpen={isEditAddressOpen} setOpen={setIsEditAddressOpen}>
        <Modal isOpen={isAddressUpdating} setOpen={setIsAddressUpdating}>
          <div className="flex flex-col gap-2 justify-center items-center">
            <CircularProgress className="!text-white"></CircularProgress>
          </div>
        </Modal>
        <div className="bg-white w-[95vw] md:w-[70vw] lg:w-[40vw]  max-h-[90vh] lg:max-h-[80vh] p-4 rounded-br-xl relative overflow-auto">
          <h3 className="text-lg lg:text-xl font-semibold">Edit Address</h3>
          <div className="flex flex-col">
            <div className=" flex gap-2 flex-col w-full md:w-[full] my-1 md:my-2.5 ">
              <p className="  text-neutral-600 text-sm md:text-base  font-semibold">
                Name <span className="text-primary">*</span>
              </p>
              <input
                className="py-1 h-7 sm:h-8 md:h-10  border border-neutral-300 px-2 rounded-md text-sm md:text-base focus:outline-primary"
                type="text"
                value={editModalState?.name}
                name="name"
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
                id=""
              />
            </div>
            {/* <div className=" flex gap-2 flex-col w-full md:w-[48%] my-1 md:my-2.5">
              <p className="  text-neutral-600 text-sm md:text-base font-semibold">
                Last Name <span className="text-primary">*</span>
              </p>
              <input
                className="py-1 h-10  border border-neutral-300 px-2 rounded-md"
                type="text"
                name="lastName"
                value={editModalState?.lastname}
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
                id=""
              />
            </div> */}

            <div className=" flex gap-2 flex-col w-full md:w-[100%]  my-1 md:my-2.5 ">
              <p className="text-neutral-600 text-sm md:text-base font-semibold">
                Company Name (optional){" "}
              </p>
              <input
                className="py-1 h-7 sm:h-8 md:h-10  border border-neutral-300 px-2 rounded-md text-sm md:text-base focus:outline-primary"
                type="text"
                value={editModalState?.company}
                name="company"
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
                id=""
              />
            </div>

            <div className=" flex gap-2 flex-col w-full md:w-[100%]  my-1 md:my-2.5  ">
              <p className="text-neutral-600 text-sm md:text-base font-semibold">
                Country <span className="text-primary">*</span>
              </p>

              <Listbox
                value={editModalState?.country}
                onChange={(e: any) => {
                  setEditModalState((val: any) => {
                    return { ...val, country: e, state: "" };
                  });
                }}
              >
                <div className="relative ">
                  <Listbox.Button className="relative w-full cursor-default  bg-white  pl-3 pr-7  text-left shadow-inner focus:outline-none sm:text-sm md:py-2 h-7 sm:h-8 md:h-10  border border-neutral-300 px-2 rounded-md text-sm md:text-base ">
                    <span className="block truncate">
                      {editModalState?.country || "Select Country"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <FlatIcon className="flaticon-arrow-down-2" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  text-sm md:text-base">
                      {allowedCountries &&
                        allowedCountries.map((country, personIdx) => (
                          <Listbox.Option
                            key={personIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-1 md:py-2 pl-3 sm:pl-5 md:pl-7 pr-2 md:pr-4 ${active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                              }`
                            }
                            value={country?.countryName}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? "font-medium" : "font-normal"
                                    }`}
                                >
                                  {country?.countryName}
                                </span>
                                {country?.countryName ===
                                  editModalState?.country ? (
                                  <span className="absolute inset-y-0 right-5 flex items-center pr-3 text-amber-600">
                                    <FlatIcon className="flaticon-check text-primary" />
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

            <div className=" flex gap-2 flex-col w-full md:w-[100%]  my-1 md:my-2.5 ">
              <p className="text-neutral-600 text-[15px] font-semibold">
                City <span className="text-primary">*</span>
              </p>
              {editModalState?.country === "United Arab Emirates" ? (
                <Listbox
                  value={editModalState?.stateCode}
                  onChange={(e: any) => {
                    setEditModalState((val: any) => {
                      return { ...val, state: e };
                    });
                  }}
                >
                  <div className="relative ">
                    <Listbox.Button className="relative w-full cursor-default  bg-white  pl-3 pr-7  text-left shadow-inner focus:outline-none sm:text-sm md:py-2 h-7 sm:h-8 md:h-10   rounded-md text-sm md:text-base   border border-neutral-300 px-2">
                      <span className="block truncate">
                        {editModalState?.state || "Select City"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <FlatIcon className="flaticon-arrow-down-2" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {constant.states.map((state, personIdx) => (
                          <Listbox.Option
                            key={personIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-1 md:py-2 pl-3 sm:pl-5 md:pl-7 pr-2 md:pr-4 ${active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                              }`
                            }
                            value={state}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? "font-medium" : "font-normal"
                                    }`}
                                >
                                  {state}
                                </span>
                                {state === editModalState?.state ? (
                                  <span className="absolute inset-y-0 right-5 flex items-center pr-3 text-amber-600">
                                    <FlatIcon className="flaticon-check text-primary" />
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
                <input
                  className="py-1 h-7 sm:h-8 md:h-10  border border-neutral-300 px-2 rounded-md text-sm md:text-base focus:outline-primary"
                  type="text"
                  name="state"
                  value={editModalState?.state}
                  onChange={(e) => {
                    handleChange(e.target.name, e.target.value);
                  }}
                  id=""
                />
              )}
            </div>

            <div className=" flex gap-2 flex-col w-full md:w-[100%]  my-1 md:my-2.5 ">
              <p className="text-neutral-600 text-[15px] font-semibold">
                Street address <span className="text-primary">*</span>
              </p>
              <input
                className="py-1 h-7 sm:h-8 md:h-10  border border-neutral-300 px-2 rounded-md text-sm md:text-base focus:outline-primary"
                type="text"
                value={editModalState?.address}
                name="address"
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
                placeholder="House number and street name"
                id=""
              />
            </div>

            <div className=" flex gap-2 flex-col w-full md:w-[full] my-1 md:my-2.5 ">
              <p className="text-neutral-600 text-[15px] font-semibold">
                Email Address <span className="text-primary">*</span>
              </p>
              <input
                className="py-1 h-7 sm:h-8 md:h-10  border border-neutral-300 px-2 rounded-md text-sm md:text-base focus:outline-primary"
                type="email"
                name="email"
                value={editModalState?.email}
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                }}
                id=""
              />
            </div>

            <div className="w-full flex gap-2 flex-col w-full md:w-[full]  my-1 md:my-2.5 ">
              <p className="text-neutral-600 text-[15px] font-semibold">
                Phone <span className="text-primary">*</span>
              </p>
              <div className="w-full flex gap-2">
                <select
                  name="ccode"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  className="py-1 h-7 sm:h-8 md:h-10  border border-neutral-300 px-2 rounded-md text-sm md:text-base focus:outline-primary bg-white"
                >
                  {allCountries.map((e, i) => {
                    return (
                      <option
                        value={e.code}
                        key={e.icon}
                        selected={
                          (editModalState?.ccode || allCountries[0].code) ==
                          e.code
                        }
                      >
                        {e.code}
                      </option>
                    );
                  })}
                </select>
                <input
                  className="py-1 h-7 sm:h-8 md:h-10 w-full  border border-neutral-300 px-2 rounded-md text-sm md:text-base focus:outline-primary"
                  type="text"
                  value={editModalState?.phoneNo}
                  name="phoneNo"
                  onChange={(e) => {
                    handleChange(e.target.name, e.target.value);
                  }}
                  id=""
                />
              </div>
            </div>

            <div className=" flex gap-2 flex-col w-full md:w-[full]  my-1 md:my-2.5">
              <p className="text-neutral-600 text-[15px] font-semibold">
                Postcode / ZIP
              </p>
              <input
                className="py-1 h-7 sm:h-8 md:h-10  border border-neutral-300 px-2 rounded-md text-sm md:text-base focus:outline-primary"
                type="text"
                name="pincode"
                value={editModalState?.pincode}
                onChange={async (e) => {
                  handleChange(e.target.name, e.target.value);

                  if (e.target.value.length === 6) {
                    const res = await addressFromPinCode(e.target.value);

                    if (res) {
                      const pickedState = props.states.filter(
                        (e) =>
                          `${e?.state}`.toLowerCase() ===
                          `${res["PostOffice"][0]["State"]}`.toLowerCase()
                      );
                      props.setUserAddress((val) => {
                        return {
                          ...val,
                          state: pickedState[0]["state"],
                          stateCode: pickedState[0]["code"],
                          city: res["PostOffice"][0]["District"],
                          country: res["PostOffice"][0]["Country"],
                        };
                      });
                    }
                  }
                }}
                id=""
              />
            </div>
          </div>
          <div className="pb-2 mt-1">
            <button
              className="px-4 py-2 bg-primary rounded-md text-white"
              onClick={async () => {
                console.log("EDIT MODAL STATTE", editModalState);

                // validate DAta 
                if (!editModalState?.name) {
                  toast.error("Please Enter Your Name");
                  return;
                } else if (!editModalState?.country) {
                  toast.error("Please Select Your Country Name");
                  return;
                } else if (!editModalState?.state) {
                  toast.error("Please Enter Your State");
                  return;
                } else if (!editModalState?.address) {
                  toast.error("Please Enter Your Address");
                  return;
                } else if (!editModalState?.phoneNo || editModalState?.phoneNo.length < 7 || editModalState?.phoneNo.length > 12) {
                  toast.error("Please Enter a Valid Mobile Number");
                  return;
                } else if (!editModalState?.email || !validateEmail(editModalState.email)) {
                  toast.error("Enter a Valid Email ID");
                  return;
                }
                // else if (!editModalState?.pincode) {
                //   toast.error("Please Enter Your Pincode");
                //   return;
                // }

                setIsAddressUpdating(true);
                await updateDefaultAddress(
                  editModalState,
                  editModalState.addressId
                );
                await queryClient.invalidateQueries({ queryKey: ["userData"] });
                props?.setUserAddress(editModalState);
                setIsAddressUpdating(false);
                setIsEditAddressOpen(false);
              }}
            >
              Save Address
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={props.selectAddressModal}
        setOpen={props.setSelectAddressModal}
      >
        <Modal
          isOpen={props.isAddressUpdating}
          setOpen={props.setIsAddressUpdating}
        >
          <div className="flex flex-col gap-2 justify-center items-center">
            <CircularProgress className="!text-white"></CircularProgress>
          </div>
        </Modal>
        <div className="bg-white w-[95vw] md:w-[70vw] lg:w-[40vw]  max-h-[90vh] lg:max-h-[80vh] p-4 rounded-br-xl relative overflow-auto">
          <h3 className="text-lg lg:text-xl font-semibold">Select Address</h3>

          <div className="flex flex-col gap-4 mt-3 ">
            {props.userAddresses && props.userAddresses.length > 0 ? (
              <div className="">
                {props.userAddresses?.map((address: any) => {
                  return (
                    <div
                      key={address?.id}
                      className="flex py-2 px-2 justify-between items-center border border-gray-200 rounded-md my-3"
                    >
                      <div className="flex flex-col gap-2">
                        <p className="font-medium">
                          Name:{" "}
                          <span className="text-gray-500">{address?.name}</span>
                        </p>
                        <p className="font-medium">
                          Address:{" "}
                          <span className="text-gray-500">
                            {address?.address}
                          </span>
                        </p>
                        <p className="font-medium">
                          Phone:{" "}
                          <span className="text-gray-500">
                            {`${address?.ccode || ""} ${address?.phoneNo}`}
                          </span>
                        </p>
                        <p className="font-medium">
                          City:{" "}
                          <span className="text-gray-500">
                            {address?.state}
                          </span>
                        </p>
                      </div>
                      <div>
                        <button
                          className="px-4 py-2 bg-primary rounded-md text-white"
                          onClick={async () => {
                            props.setIsAddressUpdating(true);
                            await updateDefaultAddress(
                              address,
                              address.addressId
                            );
                            await queryClient.invalidateQueries({
                              queryKey: ["userData"],
                            });
                            props?.setUserAddress(address);

                            props.setIsAddressUpdating(false);
                            props.setSelectAddressModal(false);
                          }}
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
