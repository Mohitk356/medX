"use client";

import React, { useState } from "react";
import Addresscard from "../addresscard/Addresscard";
import Modal from "../Modal/modal";
import { CircularProgress } from "@mui/material";
import { initialAddress } from "../../utils/utilities";
import EditDetailsModal from "../editdetailsmodal/EditDetailsModal";

const MyAddresses = (addresses) => {
  // console.log(addresses.addresses,"hhhhhhh ")

  const [isDeleting, setIsDeleting] = useState(false);
  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end items-center mb-5">
        <button
          className="px-4 py-2 rounded-md text-white bg-black"
          onClick={() => {
            setIsNewAddressOpen(true);
          }}
        >
          Add Address
        </button>
      </div>

      {isNewAddressOpen && (
        <EditDetailsModal
          isOpen={isNewAddressOpen}
          onClose={setIsNewAddressOpen}
          addressdetails={initialAddress}
          isNewAddress={true}
        />
      )}

      <div className="flex flex-wrap gap-4 sm:gap-2 md:gap-3 lg:gap-4 justify-between">
        <Modal isOpen={isDeleting} setOpen={setIsDeleting}>
          <div className="flex flex-col gap-2 justify-center items-center">
            <CircularProgress className="!text-white"></CircularProgress>
            <p className="text-white font-medium text-lg">Deleting Address.</p>
          </div>
        </Modal>
        {addresses &&
          addresses?.addresses?.map((singleaddress: any, idx: number) => {
            return (
              <Addresscard
                singleaddress={singleaddress}
                setIsDeleting={setIsDeleting}
              />
            );
          })}
      </div>
    </>
  );
};
export default MyAddresses;
