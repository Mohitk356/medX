"use client";
import React, { useState, useEffect } from "react";
import logo from "../../images/logo (2).png";
import Image from "next/image";
import Link from "next/link";
import FlatIcon from "../flatIcon/flatIcon";
import { checkUserLogin, getUserData } from "../../utils/databaseService";
import { useQuery } from "@tanstack/react-query";
// import { BsPersonFill } from "react-icons/bs";
import { auth } from "../../config/firebase-config";
import { signOut } from "firebase/auth";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import OutsideClickHandler from "../../utils/OutsideClickHandler";
import { getUserCartDetails } from "../../utils/cartUtilities/cartUtility";
const SearchHeader = ({ cookie }: any) => {
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(cookie),
    keepPreviousData: true,
  });
  const router = useRouter();
  const pathname = usePathname();
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const handleLogout = async () => {
    signOut(auth)
      .then(async () => {
        // Sign-out successful.
        setIsDropDownOpen(false);
        await axios.post("/api/logout");
        if (pathname === "/") {
          router.refresh();
        } else {
          router.push("/");
        }
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };



  return (
    <div className="flex items-center justify-between px-[3.5%] py-[10px] bg-white">
      <Link href={"/"}>
        <div>
          <Image
            src={logo}
            alt=""
            width={180}
            height={180}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      </Link>
      <div className="flex justify-between items-center gap-3 rounded-sm  w-[50%] bg-[#F9F9F9]">
        <input
          className="rounded-sm  outline-0 px-[10px] w-full py-[12px] bg-[#F9F9F9] "
          placeholder="Search for items..."
        />
        <div className="bg-[#51150A] h-full py-[14px] px-[15px] text-white rounded-r-sm">
          <FlatIcon icon="flaticon-search text-lg" />
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div>
            <FlatIcon icon="flaticon-heart text-2xl" />
            {/* <Image
              src={lilHeart}
              alt=""
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            /> */}
          </div>
          <div>Wishlist</div>
        </div>
        {checkUserLogin(cookie) ? (
          <div className="flex gap-2 items-center hover:cursor-pointer relative">
            <OutsideClickHandler
              onClick={() => {
                setIsDropDownOpen(false);
              }}
            >
              <div
                className="flex gap-2 items-center hover:cursor-pointer relative"
                onClick={() => {
                  setIsDropDownOpen(!isDropDownOpen);
                }}
              >
                <div>
                  {userData &&
                  userData?.profilePic &&
                  userData?.profilePic?.url ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={userData?.profilePic?.url}
                        alt="user profileF"
                        width={100}
                        height={100}
                        layout="responsive"
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    // <BsPersonFill />
                    <>person icon</>
                  )}
                </div>
                <div>
                  <p>{userData && userData?.name}</p>
                </div>
                <div>
                  <FlatIcon
                    icon="flaticon-down-arrow"
                    classname={`text-primary`}
                  />
                </div>
              </div>

              {/* <Link href={"/#"}>User</Link> */}
              {isDropDownOpen && (
                <div className="absolute flex flex-col gap-2 py-4 top-[50px] bg-white shadow-lg rounded-lg px-2 w-full">
                  <Link href={"/"}>Profile</Link>
                  <hr />
                  <Link
                    href={"/logout"}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </OutsideClickHandler>
          </div>
        ) : (
          <Link href={"/login"}>Login</Link>
        )}
        {/* <div className='flex items-center gap-3'>
      <div><Image src={userImg} alt=''/></div>
      <div>Ramzi Cherif</div>
      <div><Image src={arrowDown} alt=''/></div>
      </div> */}
      </div>
    </div>
  );
};

export default SearchHeader;
