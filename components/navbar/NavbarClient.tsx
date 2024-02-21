"use client";
import Link from "next/link";
// import logo from "../../images/MedX-Pharmacy-Logo-R-01 1 (1).svg";
// import Logo from "../../images/Group 34330.png"
// import logo from "../../images/Frame 34430.svg";
import logo from "../../images/logo.png";

import { Transition } from "@headlessui/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../config/firebase-config";
import { handleTypesenseSearch } from "../../config/typesense";
import { initializeCart } from "../../redux/slices/cartSlice";
import { getUserCartDetails } from "../../utils/cartUtilities/cartUtility";
import {
  fetchExchangeRate,
  getCountries,
  getUserData,
} from "../../utils/databaseService";
import useDebounce from "../../utils/useDebounce";
import FlatIcon from "../flatIcon/flatIcon";
import NavMobile from "../navMobile/NavMobile";
import Categories from "./categories/navCategories";

import { Menu } from "@headlessui/react";
import axios from "axios";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import { toast } from "react-toastify";
import { useAppSelector } from "../../redux/hooks";
import { setCurrency, setExRate } from "../../redux/slices/appSlice";
import {
  closeLoginModal,
  openLoginModal,
} from "../../redux/slices/loginModalSlice";
import OutsideClickHandler from "../../utils/OutsideClickHandler";
import { getStoreDetails } from "../../utils/databaseService";
import SideMenuLogin from "../sidemenulogin/SideMenulogin";
import SearchTile from "./searchTile";
// import { log } from "console";

const NavbarClient = ({ cookie }: any) => {
  const isLoginOpen = useAppSelector(
    (state: any) => state.loginReducer.isLoginOpen
  );
  const { cart } = useAppSelector((state: any) => state.cartReducer);

  const { currency } = useAppSelector((state: any) => state.appReducer);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const [searchedProducts, setSearchedProducts] = useState([]);
  const iconmatches = useMediaQuery("(max-width:900px)");
  const dispatch = useDispatch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [toggleGuestLogin, setToggleGuestLogin] = useState(0);

  const [showLogin, setShowLogin] = useState(false);

  async function getCurrExRate() {
    const data: any = await fetchExchangeRate({
      to: currency,
    });

    dispatch(setExRate(data?.exRate || 1));
  }

  useEffect(() => {
    getCurrExRate();
  }, [currency]);

  const { data: allowedCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
    keepPreviousData: true,
  });

  const { data: storeData } = useQuery({
    queryKey: ["storeDetails"],
    queryFn: () => getStoreDetails(),
    keepPreviousData: true,
  });

  const handleLoginClick = () => {
    // setShowLogin(true);

    dispatch(openLoginModal());
    setShowLogin(true);
    document.body.classList.add("no-scroll");
  };

  const closeLoginMenu = () => {
    setShowLogin(false);
    dispatch(closeLoginModal());
    document.body.classList.remove("no-scroll");
  };

  async function getCart() {
    const cart = await getUserCartDetails(cookie);
    dispatch(initializeCart(cart));
  }
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(cookie),
    enabled: isClient,
  });

  async function fetchSearchedProducts() {
    const res = await handleTypesenseSearch(debouncedSearch);
    if (res) {
      setSearchedProducts(res);
    }
  }

  async function handleLogout() {
    signOut(auth)
      .then(async () => {
        await axios.post(`/api/logout`);
        await queryClient.setQueryData(["userData"], null);
        toast.success("Logged out");
        router.push("/");
      })
      .catch((error) => {
        // An error happened.
        toast.error("cannot Logout at the moment");
      });
  }

  function initializeCurrency() {
    if (localStorage?.getItem("currency")) {
      dispatch(setCurrency(localStorage?.getItem("currency")));
    }
  }

  useEffect(() => {
    if (isClient) {
      initializeCurrency();
      getCart();
    }
    setIsClient(true);
  }, [isClient]);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchedProducts([]);
    }
    if (debouncedSearch) {
      fetchSearchedProducts();
      // fetch(`/api/search?q=${debouncedSearch}`);
    }
  }, [debouncedSearch]);

  function renderMenuOptions() {
    if (userData) {
      return UserDropDown(userData, handleLogout);
    }

    if (isClient && sessionStorage.getItem("guestLogin")) {
      return GuestDropDown(userData, handleLogout, setToggleGuestLogin);
    }

    return (
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={isLoginOpen ? () => {} : handleLoginClick}
      >
        <FlatIcon icon={"flaticon-user text-xl"} />
        {iconmatches ? "" : <h3>Login</h3>}
      </div>
    );

    // {userData ? (
    //   UserDropDown(userData, handleLogout)
    // ) : isClient && sessionStorage.getItem("guestLogin") ? (
    //   GuestDropDown(userData, handleLogout, setToggleGuestLogin)
    // ) : !isLoginOpen ? (
    // <div
    //   className="flex items-center gap-2 cursor-pointer"
    //   onClick={handleLoginClick}
    // >
    //   <FlatIcon icon={"flaticon-user text-xl"} />
    //   {iconmatches ? "" : <h3>Login</h3>}
    // </div>
    // ) : (
    //   <div className="flex items-center gap-2 cursor-pointer">
    //     <FlatIcon icon={"flaticon-user text-xl"} />
    //     {iconmatches ? "" : <h3>Login</h3>}
    //   </div>
    // )}

    return <></>;
  }

  return (
    <div className={`${pathname === "/checkout" && "hidden"}`}>
      <NavMobile
        cookie={cookie}
        isClient={isClient}
        handleLogout={handleLogout}
        setShowLogin={setShowLogin}
        closeLoginMenu={closeLoginMenu}
      />
      <div className={`${pathname === "/checkout" && "hidden"}`}>
        <div className="hidden md:block bg-black text-white py-1.5 lg:py-3 text-sm font-semibold w-full px-1.5 lg:px-2.5">
          <div className="flex items-center   w-[93%] mx-auto justify-between gap-1">
            <a
              href={`tel:${
                storeData && storeData?.storePhone?.split("+91")[1]
              }`}
            >
              <div className="flex items-center gap-2">
                <FlatIcon className="flaticon-support text-lg md:text-xl" />
                <h4 className="lg:text-base text-sm">Customer Help</h4>
              </div>
            </a>

            <div className="text-center lg:text-base text-sm">
              Now Shipping throughout the Middle East! Free shipping in Dubai.
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="flex items-center gap-3 relative">
                <div className=" flex items-center justify-center">
                  <Menu
                    as="div"
                    className="relative text-left flex justify-center items-center "
                  >
                    <div className="flex justify-center items-center">
                      <Menu.Button className="">
                        <div className="flex items-center  gap-2">
                          <h4 className="lg:text-base text-sm w-full line-clamp-1">
                            {(allowedCountries &&
                              allowedCountries?.filter(
                                (country) =>
                                  country?.currencyCode.toLowerCase() ===
                                  currency?.toLowerCase()
                              )[0]?.countryName) ||
                              currency}
                          </h4>
                          <FlatIcon className="flaticon-arrow-down-2 text-sm" />
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
                      <Menu.Items className="z-50 absolute right-0 mt-2 top-full  w-28 sm:w-32 md:w-44 lg:w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {allowedCountries &&
                          allowedCountries.map((val) => {
                            return (
                              <div className="px-1 py-1 " key={val}>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => {
                                        localStorage.setItem(
                                          "currency",
                                          val?.currencyCode
                                        );
                                        dispatch(
                                          setCurrency(val?.currencyCode)
                                        );
                                      }}
                                      className={`${
                                        active
                                          ? "bg-primary text-white"
                                          : "text-gray-900"
                                      } group flex w-full items-center rounded-md px-1 py-1 lg:px-2 lg:py-2 text-sm`}
                                    >
                                      <div className="flex w-full gap-2 items-center">
                                        <ReactCountryFlag
                                          countryCode={val?.countryCode}
                                          svg
                                        />
                                        <p>{val?.countryName}</p>
                                      </div>
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            );
                          })}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block  bg-primary px-2.5 rounded-bl-2xl rounded-br-2xl">
          {/* nav header section  */}
          <div className="flex text-sm  font-semibold   bg-white rounded-bl-2xl rounded-br-2xl w-full">
            <div className=" w-[93%] mx-auto flex items-center  justify-between">
              <div className="flex items-center w-1/3 ">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  // onClick={() => {
                  //   setIsPrescriptionUpload(true);
                  // }}
                >
                  <Link
                    href={"/upload-prescription"}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <div>
                      <Image
                        alt="prescription"
                        src={require("../../images/prescription.png")}
                        width={100}
                        height={100}
                        className=" w-auto h-auto object-contain"
                      />
                    </div>
                    <h3>Prescription</h3>
                  </Link>
                </div>
                {/* <div className="flex items-center gap-1 cursor-pointer invisible">
                    <div>
                      <Image
                        alt="prescription"
                        src={require("../../images/calorie_calculator.png")}
                        width={100}
                        height={100}
                        className=" w-auto h-auto object-contain"
                      />
                    </div>
                    <h3>Calorie Calculator</h3>
                  </div> */}
              </div>
              <div className="min-h-[60px]  sm:min-h-[80px] md:min-h-[100px] flex items-center w-1/3 justify-center">
                {/* {isSearchOpen ? ( */}
                <Transition
                  appear={true}
                  show={isSearchOpen}
                  className={
                    "w-full  z-40 h-full flex items-center justify-center"
                  }
                >
                  <Transition.Child
                    className="transition duration-150 w-full h-full flex items-center"
                    enter="ease-in-out"
                    enterFrom=" opacity-0"
                    enterTo=" opacity-100"
                    leave="ease-out"
                    leaveFrom=" opacity-100"
                    leaveTo=" opacity-0"
                  >
                    <OutsideClickHandler
                      className=" w-full h-full"
                      onClick={() => {
                        setTimeout(() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          setTimeout(() => {
                            setIsLogoVisible(true);
                          }, 200);
                        }, 200);
                      }}
                    >
                      <div className="relative w-full h-full flex items-center border border-gray-300  rounded-lg">
                        <div className="flex w-full">
                          <input
                            type="text"
                            placeholder="Search"
                            name=""
                            id=""
                            value={searchQuery}
                            className="p-1 md:py-2 md:px-2 rounded-lg w-full outline-none focus:border-none"
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setSearchQuery("");
                                setSearchedProducts([]);
                                router.push(`/search?q=${searchQuery}`);
                              }
                            }}
                          />
                          <Link
                            href={`/search?q=${searchQuery}`}
                            onClick={() => {
                              setSearchQuery("");
                              setSearchedProducts([]);
                            }}
                          >
                            <button className="bg-black text-white  h-full px-1 py-0.5  sm:px-2 sm:py-1 md:px-3 md:py-2 lg:px-4 lg:py-3 rounded-tr-lg rounded-br-lg text-xs md:text-sm lg:text-base ">
                              Search
                            </button>
                          </Link>
                        </div>
                        {isSearchOpen &&
                          searchedProducts.length !== 0 &&
                          pathname !== "/search" && (
                            <div className="absolute top-full rounded-lg shadow-md bg-white w-[48vw] lg:w-full lg:min-h-[100px] lg:max-h-[500px] overflow-y-auto  px-4 flex flex-col py-4 gap-2 md:gap-3 mx-auto left-1/2  transform -translate-x-1/2 ">
                              {/* <div> */}
                              {searchedProducts?.map((prod, idx) => {
                                return (
                                  <SearchTile
                                    setIsSearchOpen={setIsSearchOpen}
                                    setIsLogoVisible={setIsLogoVisible}
                                    product={prod}
                                    key={prod?.id}
                                    idx={idx}
                                    setSearchQuery={setSearchQuery}
                                  />
                                );
                              })}
                              {/* </div> */}
                            </div>
                          )}
                      </div>
                    </OutsideClickHandler>
                  </Transition.Child>
                </Transition>

                {/* // ) : ( */}
                {isLogoVisible && (
                  <Link href={"/"}>
                    <div className="w-[160px] sm:w-[180px] md:w-[200px]  border-black">
                      <Image
                        src={logo}
                        alt="logo"
                        className="w-full h-full object-fill"
                        width={1000}
                        height={1000}
                        // style={{
                        //   aspectRatio: "auto",
                        //   width: "200px",
                        //   height: "auto",
                        // }}
                        layout="responsive"
                      />
                    </div>
                  </Link>
                )}
                {/* </div> */}

                {/* {isSearchOpen || (
                    
                  )} */}
              </div>
              <div className="w-1/3 flex items-center gap-1 sm:gap-3 md:gap-5  justify-end">
                {/* <Link href={"/search"}> */}
                {isSearchOpen ? (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setTimeout(() => {
                        setIsLogoVisible(true);
                      }, 200);
                    }}
                  >
                    <FlatIcon className={"flaticon-search text-xl"} />
                    {/* {iconmatches ? "" } */}
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setIsSearchOpen(true);
                      setIsLogoVisible(false);
                    }}
                  >
                    <FlatIcon className={"flaticon-search text-xl"} />
                    {/* {iconmatches ? "" : <h3>Search...</h3>} */}
                  </div>
                )}

                <Link
                  href={"/wishlist"}
                  onClick={(e) => {
                    if (userData && auth.currentUser?.uid) {
                    } else {
                      e.preventDefault();
                      dispatch(openLoginModal());
                    }
                  }}
                  className="flex items-center  gap-2 relative"
                >
                  <FlatIcon className={"flaticon-heart text-xl"} />
                </Link>
                <Link
                  href={"/cart"}
                  className="flex items-center  gap-2 relative"
                >
                  <FlatIcon className={"flaticon-cart text-xl"} />
                  {isClient && cart?.length !== 0 && (
                    <div className="absolute -top-2 -right-2 bg-black text-white w-4 h-4 flex justify-center items-center text-xs p-[4px] rounded-full">
                      {cart?.length}
                    </div>
                  )}
                  {/* {iconmatches ? "" : <h3>My Cart</h3>} */}

                  {/* {isClient && cart && cart?.length > 0 && (
                    <div className="absolute -top-[5px] right-[2px] flex justify-center items-center bg-black text-white  w-[20px]  rounded-full h-[20px]">
                      <p className="text-xs">{cart && cart?.length}</p>
                    </div>
                  )} */}
                </Link>

                <div>{renderMenuOptions()}</div>
              </div>
            </div>
          </div>
          <Categories />
        </div>
      </div>
      {/* )} */}
      {/* {!matches2 && <Categories />} */}
      {isClient && isLoginOpen && (
        <SideMenuLogin
          isOpen={isLoginOpen}
          setShowLogin={setShowLogin}
          onClose={closeLoginMenu}
        />
      )}
    </div>
  );
};

export default NavbarClient;

function UserDropDown(userData: any, handleLogout: any): React.ReactNode {
  return (
    <div className=" flex items-center justify-center">
      <Menu
        as="div"
        className="relative text-left flex justify-center items-center "
      >
        <div className="flex justify-center items-center">
          <Menu.Button className="">
            <div className="flex items-center  gap-2">
              <FlatIcon icon={"flaticon-user text-xl"} />
              {(userData && userData?.name) || "User"}
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
          <Menu.Items className="z-50 absolute right-0 mt-2 top-full w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <Link href={"/profile"}>
                    <button
                      className={`${
                        active ? "bg-primary text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {/* {active ? "active" : "notActive"} */}
                      Profile
                    </button>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      active ? "bg-primary text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-1 py-1 text-sm`}
                  >
                    {/* {active ? "active" : "notActive"} */}
                    Logout
                  </button>
                )}
              </Menu.Item>
              {/* <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-primary text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? "active" : "notActive"}
                    Edit
                  </button>
                )}
              </Menu.Item> */}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
function GuestDropDown(
  userData: any,
  handleLogout: any,
  setToggleGuestLogin: any
): React.ReactNode {
  return (
    <div className=" flex items-center justify-center">
      <Menu
        as="div"
        className="relative text-left flex justify-center items-center "
      >
        <div className="flex justify-center items-center">
          <Menu.Button className="">
            <div className="flex items-center  gap-2">
              <FlatIcon icon={"flaticon-user text-xl"} />
              Guest
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
          <Menu.Items className="z-50 absolute right-0 mt-2 top-full w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("guestLogin");
                      setToggleGuestLogin((val: number) => val + 1);
                    }}
                    className={`${
                      active ? "bg-primary text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-1 py-1 text-sm`}
                  >
                    {/* {active ? "active" : "notActive"} */}
                    Logout
                  </button>
                )}
              </Menu.Item>
              {/* <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-primary text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? "active" : "notActive"}
                    Edit
                  </button>
                )}
              </Menu.Item> */}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
// return <div className="flex items-center  gap-2">
//   <FlatIcon icon={"flaticon-user text-xl"} />
//   {(userData && userData?.name) || "User"}
// </div>;

{
  /* <Modal
isOpen={isPrescriptionUpload}
setOpen={setIsPrescriptionUpload}
>
<div className="bg-white w-[95vw] md:w-[70vw] lg:w-[40vw] p-4 rounded-br-xl relative">
  <div className="w-full flex justify-center items-center">
    <h3 className="font-bold text-lg lg:text-xl">
      Upload Your Prescription
    </h3>
  </div>

  <div
    className="absolute right-4 top-4 cursor-pointer"
    onClick={() => {
      setIsPrescriptionUpload(false);
    }}
  >
    <FlatIcon
      className={"flaticon-close text-primary text-xl"}
    ></FlatIcon>
  </div>

  <div className="mt-6 flex flex-col gap-3">
    <input
      type="file"
      onChange={(e) => {
        console.log(e.target.value);
        setFiles(e.target.files);
      }}
    />
    {isUploading && (
      <div>
        <Box
          sx={{ position: "relative", display: "inline-flex" }}
        >
          <CircularProgress
            variant="determinate"
            value={uploadPercentage}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >{`${Math.round(uploadPercentage)}%`}</Typography>
          </Box>
        </Box>
      </div>
    )}
  </div>

  <div className="w-full mt-5">
    <button
      className="bg-primary w-full rounded-br-lg py-2 text-white font-semibold"
      onClick={uploadPrescription}
    >
      Upload
    </button>
  </div>
</div>
</Modal> */
}
