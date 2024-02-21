import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  addressFromPinCode,
  getCountries,
  getUserAddresses,
  getUserData,
} from "../../utils/databaseService";
import { useQuery } from "@tanstack/react-query";
import FlatIcon from "../flatIcon/flatIcon";
import { getCountry } from "../../utils/utilities";
import { useAppSelector } from "../../redux/hooks";
import { constant } from "../../utils/constants";

function CheckoutNewAddress(props) {
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );
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

  return (
    <div className="flex flex-wrap w-full  justify-between mt-6 ">
      <div className=" flex gap-2 flex-col w-full md:w-[48%] my-1 md:my-2.5 ">
        <p className="  text-neutral-600 text-[15px] font-semibold">
          Name <span className="text-primary">*</span>
        </p>
        <input
          className="py-1 h-7 md:h-10  border border-neutral-300 px-2 rounded-md"
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
        <p className="  text-neutral-600 text-[15px] font-semibold">Last Name *</p>
        <input
          className="py-1 h-10  border border-neutral-300 px-2"
          type="text"
          name="lastName"
          onChange={(e) => {
            props.handleChange(e.target.name, e.target.value);
          }}
          id=""
        />
      </div> */}

      {/* <div className=" flex gap-2 flex-col w-full md:w-[48%] my-1 md:my-2.5 ">
        <p className="text-neutral-600 text-[15px] font-semibold">Email Address *</p>
        <input
          className="py-1 h-10  border border-neutral-300 px-2"
          type="email"
          name="email"
          onChange={(e) => {
            props.handleChange(e.target.name, e.target.value);
          }}
          id=""
        />
      </div> */}

      <div className=" flex gap-2 flex-col w-full md:w-[48%]  my-1 md:my-2.5 ">
        <p className="text-neutral-600 text-[15px] font-semibold">Phone</p>
        <input
          className="py-1 h-7 md:h-10  border border-neutral-300 px-2 rounded-md"
          type="text"
          value={props.userAddress?.phoneNo}
          name="phoneNo"
          onChange={(e) => {
            props.handleChange(e.target.name, e.target.value);
          }}
          id=""
        />
      </div>
      <div className=" flex gap-2 flex-col w-full md:w-[100%]  my-1 md:my-2.5 ">
        <p className="text-neutral-600 text-[15px] font-semibold">
          Address <span className="text-primary">*</span>
        </p>
        <input
          className="py-1 h-7 md:h-10  border border-neutral-300 px-2 rounded-md"
          type="text"
          value={props.userAddress?.address}
          name="address"
          onChange={(e) => {
            props.handleChange(e.target.name, e.target.value);
          }}
          id=""
        />
      </div>
      <div className=" flex gap-2 flex-col w-full md:w-[48%]  my-1 md:my-2.5 ">
        <p className="text-neutral-600 text-[15px] font-semibold">
          State <span className="text-primary">*</span>
        </p>
        {props?.userAddress?.country === "United Arab Emirates" ? (
          <Listbox
            value={props.userAddress?.stateCode}
            onChange={(e: any) => {
              props.setUserAddress((val: any) => {
                return { ...val, state: e };
              });
            }}
          >
            <div className="relative ">
              <Listbox.Button className="relative w-full cursor-default  bg-white  pl-3 pr-7  text-left shadow-inner focus:outline-none sm:text-sm py-2 h-7 md:h-10  border border-neutral-300 px-2">
                <span className="block truncate">
                  {props.userAddress?.state || "Select State"}
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
                        `relative cursor-default select-none py-2 pl-7 pr-4 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={state}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {state}
                          </span>
                          {state === props.userAddress?.state ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
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
            className="py-1 h-7 md:h-10  border border-neutral-300 px-2 rounded-md"
            type="text"
            value={props.userAddress?.state}
            name="state"
            onChange={(e) => {
              props.handleChange(e.target.name, e.target.value);
            }}
            id=""
          />
        )}
      </div>
      <div className=" flex gap-2 flex-col w-full md:w-[48%]  my-1 md:my-2.5 ">
        <p className="text-neutral-600 text-[15px] font-semibold">
          City <span className="text-primary">*</span>
        </p>
        <input
          className="py-1 h-7 md:h-10  border border-neutral-300 px-2 rounded-md "
          type="text"
          name="city"
          value={props.userAddress?.city}
          onChange={(e) => {
            props.handleChange(e.target.name, e.target.value);
          }}
          id=""
        />
      </div>
      <div className=" flex gap-2 flex-col w-full md:w-[48%]  my-1 md:my-2.5 ">
        <p className="text-neutral-600 text-[15px] font-semibold">
          Pin Code <span className="text-primary">*</span>
        </p>
        <input
          className="py-1 h-7 md:h-10  border border-neutral-300 px-2 rounded-md"
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
      <div className=" flex gap-2 flex-col w-full md:w-[48%]  my-1 md:my-2.5  ">
        <p className="text-neutral-600 text-[15px] font-semibold">
          Country <span className="text-primary">*</span>
        </p>

        <Listbox
          value={props.userAddress?.stateCode}
          onChange={(e: any) => {
            props.setUserAddress((val: any) => {
              return { ...val, country: e };
            });
          }}
        >
          <div className="relative ">
            <Listbox.Button className="relative w-full cursor-default  bg-white  pl-3 pr-7  text-left shadow-inner focus:outline-none sm:text-sm py-2 h-7 md:h-10  border border-neutral-300 px-2">
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
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {allowedCountries &&
                  allowedCountries.map((country, personIdx) => (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-7 pr-4 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={country?.countryName}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {country?.countryName}
                          </span>
                          {country?.countryName ===
                          props.userAddress?.country ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
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

        {/* <input
          className="py-1 h-7 md:h-10  border border-neutral-300 px-2 text-gray-500"
          type="text"
          name="country"
          readOnly
          value={getCountry(allowedCountries, currency)?.countryName}
          id=""
        /> */}
        {/* <Listbox
          value={props.userAddress?.country}
          onChange={(e: any) => {
            props.setUserAddress((val: any) => {
              return { ...val, country: e };
            });
          }}
        >
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default  bg-white  pl-3 pr-7  text-left shadow-inner focus:outline-none sm:text-sm py-2 h-7 md:h-10  border border-neutral-300 px-2">
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
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <Listbox.Option
                  key={"INDIA"}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-7 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={"India"}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {"India"}
                      </span>
                      {props.userAddress?.country === "India" ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          check
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox> */}
      </div>

      <div className="w-full flex gap-2 items-center justify-between mt-4">
        <div className="flex gap-2">
          <input
            type="checkbox"
            name=""
            id=""
            value={props.makeDefaultAddress}
            onChange={(e) => {
              props.setMakeDefaultAddress(e.target.checked);
            }}
          />
          <span className="text-neutral-600 text-[15px] font-semibold">
            Make this default address
          </span>
        </div>
      </div>
      <div className="w-full flex gap-2 items-center justify-between mt-6 ">
        <div className="flex items-center gap-8 w-full">
          {(userAddresses?.length !== 0 || userData?.defaultAddress) && (
            <button
              className="w-[50%] md:py-1 h-10 md:h-10  border border-primary  hover:bg-white hover:text-black  bg-primary text-white text-sm md:text-base"
              onClick={() => {
                props.setUserAddress(userData?.defaultAddress);
                props.setIsNewAddress(false);
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
  );
}
export default CheckoutNewAddress;
