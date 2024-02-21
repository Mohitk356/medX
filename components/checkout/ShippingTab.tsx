import { useQuery, useQueryClient } from "@tanstack/react-query";
import CheckoutNewAddress from "./CheckoutNewAddress";
import {
  getUserAddresses,
  getUserData,
  updateDefaultAddress,
} from "../../utils/databaseService";
import { initialAddress } from "../../utils/utilities";
import { useState } from "react";
import Modal from "../Modal/modal";
import { CircularProgress } from "@mui/material";

function ShippingTab(props) {
  const queryClient = useQueryClient();
  const [isAddressUpdating, setIsAddressUpdating] = useState(false);
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(null),
    keepPreviousData: true,
  });
  const { data: userAddresses }:any = useQuery({
    queryKey: ["userAddresses"],
    queryFn: () => getUserAddresses(null),
    keepPreviousData: true,
  });
  const [selectAddressModal, setSelectAddressModal] = useState(false);

  return (
    <div className="flex flex-col mt-1 w-full ">
      <h6 className="font-medium  text-base  text-neutral-400 ">
        Enter your Shipping Details
      </h6>
      {props.userData?.defaultAddress && !props.isNewAddress ? (
        <div className="flex flex-col gap-4 ">
          <div className=" rounded-br-[10px] border border-primary mt-4 flex justify-between  px-4 py-4  shadow-md">
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-lg font-medium">Shipping Address</p>
              <div className="flex flex-col gap-2">
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
                    {props.userData?.defaultAddress?.phoneNo}
                  </span>
                </p>
                <p className="font-medium">
                  State:{" "}
                  <span className="text-gray-500">
                    {props.userData?.defaultAddress?.state}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <button
                onClick={() => {
                  setSelectAddressModal(true);
                }}
                className=" bg-primary text-white sm:py-2 px-2 hover:bg-white hover:text-black cursor-pointer rounded-br-[10px] border border-primary h-[30px] sm:h-[40px] md:h-[50px]"
              >
                Change Address
              </button>
              <button
                className=" bg-primary text-white sm:py-2 px-2 hover:bg-white hover:text-black cursor-pointer rounded-br-[10px] border border-primary h-[30px] sm:h-[40px] md:h-[50px]"
                onClick={() => {
                  props.setUserAddress(initialAddress);
                  props.setIsNewAddress(true);
                }}
              >
                Add New Address
              </button>
            </div>
          </div>

          <Modal isOpen={selectAddressModal} setOpen={setSelectAddressModal}>
            <Modal isOpen={isAddressUpdating} setOpen={setIsAddressUpdating}>
              <div className="flex flex-col gap-2 justify-center items-center">
                <CircularProgress className="!text-white"></CircularProgress>
              </div>
            </Modal>
            <div className="bg-white w-[95vw] md:w-[70vw] lg:w-[40vw]  max-h-[90vh] lg:max-h-[80vh] p-4 rounded-br-xl relative overflow-auto">
              <h3 className="text-lg lg:text-xl font-semibold">
                Select Address
              </h3>

              <div className="flex flex-col gap-4 mt-3 ">
                {userAddresses && userAddresses.length > 0 ? (
                  <div className="">
                    {userAddresses?.map((address: any) => {
                      return (
                        <div
                          key={address?.id}
                          className="flex py-2 px-2 justify-between items-center border border-gray-200 rounded-md my-3"
                        >
                          <div className="flex flex-col gap-2">
                            <p className="font-medium">
                              Name:{" "}
                              <span className="text-gray-500">
                                {address?.name}
                              </span>
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
                                {address?.phoneNo}
                              </span>
                            </p>
                            <p className="font-medium">
                              State:{" "}
                              <span className="text-gray-500">
                                {address?.state}
                              </span>
                            </p>
                          </div>
                          <div>
                            <button
                              className="px-4 py-2 bg-primary rounded-md text-white"
                              onClick={async () => {
                                setIsAddressUpdating(true);
                                await updateDefaultAddress(address);
                                await queryClient.invalidateQueries({
                                  queryKey: ["userData"],
                                });
                                setIsAddressUpdating(false);
                                setSelectAddressModal(false);
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
      ) : (
        <CheckoutNewAddress
          states={props.states}
          userAddress={props.userAddress}
          setUserAddress={props.setUserAddress}
          handleAddressSubmit={props.handleAddressSubmit}
          makeDefaultAddress={props.makeDefaultAddress}
          setMakeDefaultAddress={props.setMakeDefaultAddress}
          handleChange={props.handleChange}
          setIsNewAddress={props.setIsNewAddress}
        />
      )}
    </div>
  );
}

export default ShippingTab;
