import React, { Fragment, useState } from "react";
import Modal from "../Modal/modal";
import { toast } from "react-toastify";
import { UpdateEditDetails, getCountries } from "../../utils/databaseService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { Listbox, Transition } from "@headlessui/react";
import FlatIcon from "../flatIcon/flatIcon";
import { constant } from "../../utils/constants";

const EditDetailsModal = ({
  isOpen,
  onClose,
  addressdetails,
  isNewAddress = false,
}) => {
  const queryClient = useQueryClient();
  const { data: allowedCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
    keepPreviousData: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fname: addressdetails.name || "",
    address: addressdetails.address || "",
    city: addressdetails.city || "",
    state: addressdetails.state || "",
    pincode: addressdetails.pincode || "",
    country: addressdetails.country || "",
    phoneNo: addressdetails.phoneNo || "",
    defaultAddress: addressdetails.defaultAddress || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSave = async () => {
    const updatedUserData = {
      name: formData.fname,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      country: formData.country,
      phoneNo: formData.phoneNo,
      defaultAddress: formData.defaultAddress,
      state: formData?.city,
    };

    try {
      console.log("STARTED ADDING");
      setIsLoading(true);
      await UpdateEditDetails(addressdetails.id, updatedUserData, {
        isNewAddress,
      });
      await queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      await queryClient.refetchQueries({ queryKey: ["userAddresses"] });
      await queryClient.invalidateQueries({ queryKey: ["userData"] });
      setIsLoading(false);
      toast.success("Address Details Saved");
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Something went wrong.");
      setIsLoading(false);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} setOpen={onClose}>
      <div className="bg-white w-[95vw] md:w-[70vw] lg:w-[40vw] p-4 rounded-br-xl relative">
        <div className="w-full flex justify-center items-center mb-6">
          <h3 className="font-bold text-lg lg:text-xl">Edit Address Details</h3>
        </div>

        <div className="flex flex-col  gap-2 md:gap-6">
          <div className="flex flex-col md:flex-row gap-4  lg:gap-6 ">
            <div className="w-full">
              <h1 className="text-sm md:text-base font-normal  text-neutral-400  uppercase">
                Name:
              </h1>
              <div className=" w-[100%]  ">
                <input
                  type="text"
                  name="fname"
                  onChange={handleChange}
                  value={formData.fname}
                  className=" w-full h-6 sm:h-8 md:h-10 pb-1 border-b-2  border-neutral-300 focus:outline-none focus:border-neutral-500 text-sm md:text-base font-semibold"
                  required
                />
              </div>
            </div>

            <div className="w-full">
              <h1 className="text-sm md:text-base font-normal  text-neutral-400  uppercase">
                Mobile Number
              </h1>
              <div className=" w-[100%] rounded-md">
                <input
                  type="text"
                  name="phoneNo"
                  onChange={handleChange}
                  value={formData.phoneNo}
                  className="w-full h-6 sm:h-8 md:h-10 pb-1 border-b-2  border-neutral-300 focus:outline-none focus:border-neutral-500 text-sm md:text-base font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-10 lg:gap-16 ">
            <div className="w-full">
              <h1 className="text-sm md:text-base font-normal text-neutral-400 uppercase">
                Country
              </h1>
              <Listbox
                value={formData?.country}
                onChange={(e: any) => {
                  setFormData((val: any) => {
                    return { ...val, country: e, city: "" };
                  });
                }}
              >
                <div className="relative ">
                  <Listbox.Button className="relative w-full cursor-default  bg-white  pl-3 pr-7  text-left shadow-inner focus:outline-none sm:text-sm py-2 h-10 md:h-10  border-b border-neutral-300 px-2 z-50">
                    <span className="block truncate font-semibold">
                      {formData?.country || "Select Country"}
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
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
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
                                {country?.countryName === formData?.country ? (
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
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-10 lg:gap-16 ">
            <div className="w-full ">
              {formData?.country === "United Arab Emirates" ? (
                <>
                  <p className="text-neutral-600 text-[15px] font-semibold">
                    State <span className="text-primary">*</span>
                  </p>
                  <Listbox
                    value={formData?.city}
                    onChange={(e: any) => {
                      setFormData((val: any) => {
                        return { ...val, city: e };
                      });
                    }}
                  >
                    <div className="relative ">
                      <Listbox.Button className="relative w-full cursor-default z-40  bg-white  pl-3 pr-7  text-left shadow-inner focus:outline-none sm:text-sm py-2 h-10 md:h-10  border border-neutral-300 px-2">
                        <span className="block truncate">
                          {formData?.city || "Select State"}
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
                                  {state === formData?.state ? (
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
                </>
              ) : (
                <div className="w-full">
                  <h1 className="text-sm md:text-base font-normal text-neutral-400 uppercase">
                    City
                  </h1>
                  <div className=" w-[100%] rounded-md">
                    <input
                      type="text"
                      name="city"
                      onChange={handleChange}
                      value={formData.city}
                      className="w-full h-6 sm:h-8 md:h-10 pb-1 border-b-2  border-neutral-300 focus:outline-none focus:border-neutral-500 text-sm md:text-base font-semibold"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-10 lg:gap-16 ">
            <div className="w-full">
              <h1 className="text-sm md:text-base font-normal text-neutral-400 uppercase">
                Pin Code
              </h1>
              <div className=" w-[100%] rounded-md">
                <input
                  type="text"
                  name="pincode"
                  onChange={handleChange}
                  value={formData.pincode}
                  className="w-full h-6 sm:h-8 md:h-10 pb-1 border-b-2  border-neutral-300 focus:outline-none focus:border-neutral-500 text-sm md:text-base font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-10 lg:gap-16 ">
            <div className="w-full">
              <h1 className="text-sm md:text-base font-normal text-neutral-400 uppercase">
                Address
              </h1>
              <div className=" w-[100%] rounded-md">
                <input
                  type="text"
                  name="address"
                  onChange={handleChange}
                  value={formData.address}
                  className="w-full h-6 sm:h-8 md:h-10 pb-1 border-b-2  border-neutral-300 focus:outline-none focus:border-neutral-500 text-sm md:text-base font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-center md:flex-row gap-4 md:gap-10 lg:gap-16 ">
            <div className="w-[47%]">
              <label>
                <input
                  type="checkbox"
                  name="defaultAddress"
                  className="mr-2"
                  checked={formData.defaultAddress}
                  onChange={handleChange}
                />
                Make it Default Address
              </label>
            </div>
            <div className="h-[45px] sm:h-[50px] md:h-[55px] w-[47%] cursor-pointer bg-[#E64040]  border-2 hover:cursor-pointer  hover:border-[#E64040] hover:bg-white rounded-br-[10px] flex item-center justify-center">
              <button
                className="w-full h-full text-sm sm:text-base md:text-lg text-white  hover:text-[#E64040] flex justify-center items-center font-medium "
                onClick={handleSave}
              >
                {isLoading ? (
                  <CircularProgress className="!text-white" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>

          {/* <form>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Mobile Number:</label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="defaultAddress"
                checked={formData.defaultAddress}
                onChange={handleChange}
              />
              Make it Default Address
            </label>
          </div>
        </form> */}
        </div>
      </div>
    </Modal>
  );
};

export default EditDetailsModal;
