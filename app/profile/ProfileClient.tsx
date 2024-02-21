"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cookies } from "next/dist/client/components/headers";
// import PersonalInfo from "../../components/personalinfo/PersonalInfo";
import MyOrders from "../../components/myorders/Myorders";
// import MyAddresses from "../../components/myaddresses/MyAdresses";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { auth, db, storage } from "../../config/firebase-config";
import EditIcon from "@mui/icons-material/Edit";
import {
  getUserAddresses,
  getUserData,
  updateDefaultAddress,
  getUserOrders,
} from "../../utils/databaseService";
import MyAddresses from "../../components/myaddresses/MyAdresses";
import PersonalInfo from "../../components/personalinfo/PersonalInfo";
import FlatIcon from "../../components/flatIcon/flatIcon";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import Modal from "../../components/Modal/modal";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import MyWallet from "../../components/myWallet/MyWallet";

const ProfileClient = ({ cookie }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [isProfileUploading, setIsProfileUploading] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(cookie),
    keepPreviousData: true,
  });

  const { data: userAddresses }: any = useQuery({
    queryKey: ["userAddresses"],
    queryFn: () => getUserAddresses(cookie),
    keepPreviousData: true,
  });

  const { data: userOrders } = useQuery({
    queryKey: ["userOrders"],
    queryFn: () => getUserOrders(cookie),
    keepPreviousData: true,
  });
  const [selectedImage, setSelectedImage] = useState(null);

  async function handleLogout() {
    signOut(auth)
      .then(async () => {
        toast.success("Logged out");
        await axios.post(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/logout`);
        queryClient.invalidateQueries({ queryKey: ["userData"] });
        queryClient.refetchQueries({ queryKey: ["userData"] });
        // Sign-out successful.
        router.replace("/");
      })
      .catch((error) => {
        // An error happened.
        toast.error("cannot Logout at the moment");
      });
  }

  function handleEditProfilePic() {
    const filePicker = document.getElementById("profile");
    filePicker.click();
  }

  async function changeProfilePic() {
    if (selectedImage) {
      let storageRef;
      storageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/${selectedImage.name}`
      );
      setIsProfileUploading(true);
      const uploadTask = await uploadBytes(storageRef, selectedImage);
      let url = await getDownloadURL(storageRef);

      console.log({ url });
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        dP: url,
      });

      await queryClient.invalidateQueries({ queryKey: ["userData"] });
      setIsProfileUploading(false);
    } else {
      // toast.error("Select Image");
    }
  }

  useEffect(() => {
    changeProfilePic();
  }, [selectedImage]);

  // console.log(userData,"pppppp");

  const [activeTab, setActiveTab] = useState("myOrders");

  return (
    <div className="px-body ">
      <div className="w-full flex md:flex-row flex-col gap-3 sm:gap-5 md:gap-8 lg:gap-12 my-10 ">
        <div className="w-full md:w-[30%] ">
          <div className="flex flex-row md:flex-col lg:flex-row px-2 py-3 sm:px-5 sm:py-6 gap-4 sm:gap-6 md:gap-2 lg:gap-7  items-center w-full  h-fit bg-red-50 rounded-[10px]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 aspect-square">
              {userData && userData?.dP?.includes("assets/img") ? (
                <div className="flex justify-center items-center bg-gray-300 w-full h-full rounded-full relative">
                  <FlatIcon className="flaticon-user text-3xl text-gray-500"></FlatIcon>
                  <div
                    className="absolute bottom-1 right-1 bg-gray-800 p-1 md:p-2 rounded-full flex justify-center items-center"
                    onClick={(e) => {
                      handleEditProfilePic();
                    }}
                  >
                    <input
                      type="file"
                      name=""
                      id="profile"
                      className="w-0 h-0 invisible"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files.length === 0) {
                          setSelectedImage(null);
                          return;
                        }

                        setSelectedImage(e.target.files[0]);
                      }}
                    />
                    <EditIcon className="!text-white !text-xs md:!text-sm" />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center bg-gray-300 w-full h-full rounded-full relative">
                  <div className="w-full h-full">
                    <Image
                      src={userData?.dP}
                      alt={userData?.name || "profile picture"}
                      width={1000}
                      height={1000}
                      className=" w-full h-full object-cover  rounded-full"
                    />
                  </div>
                  <div
                    className="absolute bottom-1 right-1 bg-gray-800 cursor-pointer p-1 md:p-2 rounded-full flex justify-center items-center"
                    onClick={(e) => {
                      handleEditProfilePic();
                    }}
                  >
                    <input
                      type="file"
                      name=""
                      id="profile"
                      className="w-0 h-0 invisible"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files.length === 0) {
                          setSelectedImage(null);
                          return;
                        }

                        setSelectedImage(e.target.files[0]);
                      }}
                    />
                    <EditIcon className="!text-white !text-xs md:!text-sm" />
                  </div>
                </div>
              )}
            </div>

            <div className=" flex flex-col gap-1 md:items-center lg:items-start">
              <h3 className=" tracking-tight text-black text-sm md:text-base  font-semibold">
                {isClient && userData && userData.name
                  ? userData.name
                  : "Your Name"}
              </h3>
              <h3 className=" text-xs md:text-sm   tracking-tight text-black font-semibold">
                {isClient && userData && userData.email
                  ? userData.email
                  : "Your Email"}
              </h3>
              <h3 className=" tracking-tight text-black text-sm md:text-base  font-semibold mt-2">
                {isClient && userData && userData.phoneNo
                  ? userData.phoneNo
                  : "Your Phone Number"}
              </h3>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="my-2 sm:my-3 md:my-5 lg:my-8 flex flex-col gap-3 md:gap-6  rounded-br-[20px] py-3   border border-black border-opacity-25">
              <div
                className="flex flex-col   px-3 cursor-pointer"
                onClick={() => setActiveTab("myOrders")}
              >
                <p
                  className={` text-sm sm:text-base md:text-lg  tracking-tight font-semibold ${
                    activeTab === "myOrders" ? "text-red-600" : "text-black"
                  }`}
                >
                  My Orders{" "}
                  {/* <span>({isClient && userOrders && userOrders.length})</span> */}
                </p>
                <p className="font-semibold text-neutral-600 text-xs md:text-sm ">
                  View Order Status
                </p>
              </div>

              <div
                className="flex flex-col   px-3 cursor-pointer "
                onClick={() => setActiveTab("myAddresses")}
              >
                <p
                  className={` text-sm sm:text-base md:text-lg  tracking-tight font-semibold ${
                    activeTab === "myAddresses" ? "text-red-600" : "text-black"
                  }`}
                >
                  My Addresses
                </p>
                <p className="font-semibold text-neutral-600 text-xs md:text-sm ">
                  {" "}
                  Save, Delete & Change addresses
                </p>
              </div>

              {/* <div
                className="flex flex-col   px-3 cursor-pointer "
                onClick={() => setActiveTab("myWallet")}
              >
                <p
                  className={` text-sm sm:text-base md:text-lg  tracking-tight font-semibold ${
                    activeTab === "myWallet" ? "text-red-600" : "text-black"
                  }`}
                >
                  My Cashbacks
                </p>
                <p className="font-semibold text-neutral-600 text-xs md:text-sm ">
                  {" "}
                  Buy products uding cashback
                </p>
              </div> */}

              <div
                className="flex flex-col   px-3 cursor-pointer"
                onClick={() => setActiveTab("personalInfo")}
              >
                <p
                  className={` text-sm sm:text-base md:text-lg  tracking-tight font-semibold ${
                    activeTab === "personalInfo" ? "text-red-600" : "text-black"
                  }`}
                >
                  Personal Info
                </p>
                <p className="font-semibold text-neutral-600 text-xs md:text-sm ">
                  View or edit your personal info
                </p>
              </div>

              <Link
                href={`/wishlist`}
                prefetch={true}
                className="flex flex-col   px-3 cursor-pointer"
              >
                <p
                  className={` text-sm sm:text-base md:text-lg  tracking-tight font-semibold ${"text-black"}`}
                >
                  My Wishlist
                </p>
                <p className="font-semibold text-neutral-600 text-xs md:text-sm ">
                  View or edit your wishlist
                </p>
              </Link>

              <div
                className="flex flex-col   px-3 cursor-pointer"
                onClick={handleLogout}
              >
                <p className="text-black text-sm sm:text-base md:text-lg  tracking-tight font-semibold ">
                  Logout
                </p>
                {/* <p className="font-semibold text-neutral-600 text-xs md:text-sm ">
                  View all of your prescriptions
                </p> */}
              </div>
            </div>
          </div>
        </div>
        {isProfileUploading && (
          <Modal setOpen={() => {}} isOpen={isProfileUploading}>
            <div className="flex flex-col gap-3 items-center">
              <CircularProgress className="!text-primary" size={40} />
              <p className="text-white font-medium text-xl">
                Uploading Profile Picture
              </p>
            </div>
          </Modal>
        )}
        <div className="w-full md:w-[75%]  flex flex-col">
          {activeTab === "myOrders" && <MyOrders userOrders={userOrders} />}
          {activeTab === "myAddresses" && (
            <MyAddresses addresses={userAddresses} />
          )}
          {activeTab === "personalInfo" && <PersonalInfo userdata={userData} />}
          {activeTab === "myWallet" && <MyWallet userdata={userData} />}
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
