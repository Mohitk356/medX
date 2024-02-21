"use client";
import { Listbox, Transition } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { constant } from "../../utils/constants";
import { Menu } from "@headlessui/react";
import ReactCountryFlag from "react-country-flag";
import { allCountries } from "../../utils/constants";
import {
  addressFromPinCode,
  getCountries,
  getUserAddresses,
  getUserData,
} from "../../utils/databaseService";
import FlatIcon from "../flatIcon/flatIcon";
import SelectUserAddressSection from "./SelectUserAddressSections";

function NewAddress(props) {
  const queryClient = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(null),
    refetchInterval: 2000,
    keepPreviousData: true,
  });
  const { data: userAddresses }: any = useQuery({
    queryKey: ["userAddresses"],
    queryFn: () => getUserAddresses(null),
    refetchInterval: 2000,
    keepPreviousData: true,
  });

  const { data: allowedCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
    keepPreviousData: true,
  });
  const [dialcountry, setdialcountry] = useState(allCountries[0]);
  const [selectAddressModal, setSelectAddressModal] = useState(false);
  const [isAddressUpdating, setIsAddressUpdating] = useState(false);

  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  // function updateUserAddressCountryAccordingToCurrency() {
  //   let current =
  //     allowedCountries &&
  //     allowedCountries?.filter(
  //       (country) =>
  //         country?.currencyCode?.toLowerCase() === currency?.toLowerCase()
  //     )[0]?.countryName;

  //   if (current) {
  //     props.setUserAddress((val) => {
  //       return { ...val, country: current };
  //     });
  //   }
  // }

  // useEffect(() => {
  //   updateUserAddressCountryAccordingToCurrency();
  // }, [props?.isNewAddress]);

  return (
    <>
      {props.userData?.defaultAddress && !props.isNewAddress ? (
        <SelectUserAddressSection
          userData={props.userData}
          setUserAddress={props.setUserAddress}
          setIsNewAddress={props.setIsNewAddress}
          invalidateQueries={queryClient.invalidateQueries}
          userAddresses={userAddresses}
          selectAddressModal={selectAddressModal}
          setSelectAddressModal={setSelectAddressModal}
          isAddressUpdating={isAddressUpdating}
          setIsAddressUpdating={setIsAddressUpdating}
          userAddress={props?.userAddress}
          handleChange={props?.handleChange}
        />
      ) : (
        <div className="flex flex-col w-full  justify-between mt-3 md:mt-6 ">
          <div className=" flex gap-2 flex-col w-full md:w-[full] my-1 md:my-2.5 ">
            <p className="  text-neutral-600 text-sm md:text-base  font-semibold">
              Name <span className="text-primary">*</span>
            </p>
            <input
              className="py-1 h-7 sm:h-8 md:h-10  border border-neutral-300 px-2 rounded-md text-sm md:text-base focus:outline-primary"
              type="text"
              value={props.userAddress?.name}
              name="name"
              onChange={(e) => {
                props.handleChange(e.target.name, e.target.value);
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
              value={props.userAddress?.lastname}
              onChange={(e) => {
                props.handleChange(e.target.name, e.target.value);
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
              value={props.userAddress?.company}
              name="company"
              onChange={(e) => {
                props.handleChange(e.target.name, e.target.value);
              }}
              id=""
            />
          </div>

          <div className=" flex gap-2 flex-col w-full md:w-[100%]  my-1 md:my-2.5  ">
            <p className="text-neutral-600 text-sm md:text-base font-semibold">
              Country <span className="text-primary">*</span>
            </p>

            <Listbox
              value={props.userAddress?.country}
              onChange={(e: any) => {
                props.setUserAddress((val: any) => {
                  return { ...val, country: e, state: "" };
                });
              }}
            >
              <div className="relative ">
                <Listbox.Button className="relative w-full cursor-default  bg-white  pl-3 pr-7  text-left shadow-inner focus:outline-none sm:text-sm md:py-2 h-7 sm:h-8 md:h-10  border border-neutral-300 px-2 rounded-md text-sm md:text-base ">
                  <span className="block truncate">
                    {props.userAddress?.country || "Select Country"}
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
                                props.userAddress?.country ? (
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
            {props?.userAddress?.country === "United Arab Emirates" ? (
              <Listbox
                value={props.userAddress?.stateCode}
                onChange={(e: any) => {
                  props.setUserAddress((val: any) => {
                    return { ...val, state: e, city: e };
                  });
                }}
              >
                <div className="relative ">
                  <Listbox.Button className="relative w-full cursor-default  bg-white  pl-3 pr-7  text-left shadow-inner focus:outline-none sm:text-sm md:py-2 h-7 sm:h-8 md:h-10   rounded-md text-sm md:text-base   border border-neutral-300 px-2">
                    <span className="block truncate">
                      {props.userAddress?.state || "Select City"}
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
                              {state === props.userAddress?.state ? (
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
                value={props.userAddress?.state}
                onChange={(e) => {
                  props.handleChange(e.target.name, e.target.value);
                  props.handleChange("city", e.target.value);
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
              value={props.userAddress?.address}
              name="address"
              onChange={(e) => {
                props.handleChange(e.target.name, e.target.value);
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
              value={props.userAddress?.email}
              onChange={(e) => {
                props.handleChange(e.target.name, e.target.value);
              }}
              id=""
            />
          </div>

          <div className=" flex gap-2 flex-col w-full md:w-[full]  my-1 md:my-2.5 ">
            <p className="text-neutral-600 text-[15px] font-semibold">
              Phone <span className="text-primary">*</span>
            </p>
            <div className="flex w-full ">
              <Menu
                as="div"
                className="w-[15%] relative text-left flex justify-center items-center  "
              >
                <div className="flex justify-center items-center w-full">
                  <Menu.Button className="w-full px-[4px] sm:px-[6px] md:px-[8px] lg:px-[10px] py-[9px] sm:py-[11px] md:py-[13px] lg:py-[7px]   mb-[15px]  bg-gray-100 border  border-gray-100  ">
                    <div className="flex items-center gap-1 md:gap-2">
                      <ReactCountryFlag countryCode={dialcountry?.icon} svg />
                      <h4 className="lg:text-base md:text-sm text-xs">
                        {dialcountry?.code}
                      </h4>
                      <FlatIcon className="flaticon-arrow-down-2 text-xs md:text-sm" />
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="z-50 absolute left-0  top-full w-52 sm:w-48 lg:w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-[25vh] overflow-y-auto">
                    {allCountries?.map((country, id) => {
                      return (
                        <div className="px-1 py-1 " key={id}>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  setdialcountry(country);
                                  props.handleChange("ccode", country.code);
                                }}
                                className={`${active
                                  ? "bg-primary text-white"
                                  : "text-gray-900"
                                  } group flex gap-4 w-full items-center rounded-md px-1 py-1 lg:px-2 lg:py-2 text-sm`}
                              >
                                <ReactCountryFlag
                                  countryCode={country?.icon}
                                  svg
                                />
                                {/* {active ? "active" : "notActive"} */}
                                {country?.code}

                                <h1 className=" line-clamp-1 text-left">
                                  {country?.name}
                                </h1>
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      );
                    })}
                  </Menu.Items>
                </Transition>
              </Menu>
              <input
                className="w-[83%] py-1 h-7 sm:h-8 md:h-10  border border-neutral-300 px-2 rounded-md text-sm md:text-base focus:outline-primary"
                type="text"
                value={props.userAddress?.phoneNo}
                name="phoneNo"
                onChange={(e) => {
                  props.handleChange(e.target.name, e.target.value);
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
              value={props?.userAddress?.pincode}
              onChange={async (e) => {
                props.handleChange(e.target.name, e.target.value);

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

          {!sessionStorage.getItem("guestLogin") && (
            <>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    props.setSaveAddress(e.target.checked);
                  }}
                />
                <p>Save this address</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    props.setMakeDefault(e.target.checked);
                  }}
                />
                <p>Make default address</p>
              </div>
            </>
          )}

          <div className="w-full flex gap-2 items-center justify-between mt-6 ">
            <div className="flex items-center gap-8 w-full">
              {(userAddresses?.length !== 0 || userData?.defaultAddress) && (
                <button
                  className="w-[50%] md:py-1 h-7 sm:h-8 md:h-10 rounded-md  border border-primary  hover:bg-white hover:text-black  bg-primary text-white text-sm md:text-base"
                  onClick={() => {
                    props.setUserAddress(userData?.defaultAddress);
                    props.setIsNewAddress(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Select From My Addreses
                </button>
              )}
              {/* <button
            className="w-[50%] py-1 h-10  border border-primary  hover:bg-white hover:text-black  bg-primary text-white "
            onClick={props.handleAddressSubmit}
          >
            Continue
          </button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default NewAddress;
