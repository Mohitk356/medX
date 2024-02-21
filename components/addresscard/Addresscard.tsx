"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RemoveAddress,
  getUserData
} from "../../utils/databaseService";
import EditDetailsModal from "../editdetailsmodal/EditDetailsModal";

const Addresscard = ({ singleaddress, setIsDeleting }) => {
  const queryClient = useQueryClient();


  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(null),
    keepPreviousData: true,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleRemoveAddress = async (AddressId) => {
    try {
      setIsDeleting(true);
      await RemoveAddress(AddressId);
      await queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      setIsDeleting(false);
      toast.success("Address removed successfully");
    } catch (error) {
      console.error("Error removing address:", error);
      toast.error("Something went wrong while removing the address.");
    }
  };

  let singleadd = singleaddress;

  return (
    <div className="flex flex-col gap-1 justify-between sm:gap-2 md:gap-3  rounded-br-[20px]  border border-[#E64040]   sm:w-[48.5%] w-full h-auto">
      <div className="flex justify-between items-center mt-2 md:mt-4 px-1 sm:px-2 md:px-3 lg:px-4 ">
        <h3 className="tracking-tight font-semibold text-black text-sm sm:text-base md:text-lg ">
          {singleaddress && singleadd.name ? singleadd.name : "Your Name"}
        </h3>
        {singleaddress &&
        singleadd?.address === userData?.defaultAddress?.address ? (
          <div className="w-fit h-fit bg-black  px-4 py-0.5 md:px-5 md:py-1 lg:px-6 lg:py-1.5 rounded-full ">
            <p className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-medium ">
              DEFAULT
            </p>
          </div>
        ) : null}
      </div>

      <div className="w-[240px]  flex flex-col gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 text-base">
        <h3 className="text-neutral-600   font-semibold text-opacity-75  text-xs md:text-sm lg:text-base  tracking-tight">
          {singleaddress && singleadd.address ? singleadd.address : ""},{" "}
          {singleadd.city ? singleadd.city : ""},{" "}
          {singleadd.state ? singleadd.state : ""}-
          {singleadd.pincode ? singleadd.pincode : ""},{" "}
          {singleadd.country ? singleadd.country : ""}
        </h3>
        <h3 className="text-neutral-600   font-semibold text-opacity-75 text-xs md:text-sm lg:text-base  tracking-tight">
          Mobile :
          <span className=" text-black">
            {" "}
            {singleaddress && singleadd.phoneNo
              ? singleadd.phoneNo
              : "Phone Number"}
          </span>
        </h3>
      </div>

      <div className="flex h-[27px] sm:h-[36px] md:h-[45px] lg:h-[54px] bg-[#FAEFEF] mt-1 sm:mt-2 md:mt-3  rounded-br-[20px] border-t border-[#E64040]">
        <div className="w-[50%] flex justify-center  cursor-pointer items-center border-r border-[#E64040]" onClick={() => handleRemoveAddress(singleadd.id)}>
          <p
            className="text-primary text-xs md:text-sm font-semibold   tracking-tight"
          >
            REMOVE
          </p>
        </div>
        {/* <div className="border-r-2 border-primary"></div> */}
        <div className="w-[50%]  flex justify-center  cursor-pointer items-center " onClick={handleOpenEditModal}>
          <p
            className="text-black text-xs md:text-sm font-semibold tracking-tight"
   
          >
            EDIT
          </p>
        </div>

        {isEditModalOpen && (
          <EditDetailsModal
            isOpen={isEditModalOpen}
            onClose={setIsEditModalOpen}
            addressdetails={singleadd}
          />
        )}
      </div>
    </div>
  );
};
export default Addresscard;
