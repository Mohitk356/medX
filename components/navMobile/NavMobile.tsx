"use client";
import React, { useState, useEffect, Fragment, useRef } from "react";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
// import logo from "../../images/logo.png";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../images/logo.png";
import FlatIcon from "../flatIcon/flatIcon";
import { useQuery } from "@tanstack/react-query";
import {
  getCountries,
  getStoreDetails,
  getUserData,
} from "../../utils/databaseService";
import { openLoginModal } from "../../redux/slices/loginModalSlice";
import { useDispatch } from "react-redux";
import SideMenuLogin from "../sidemenulogin/SideMenulogin";
import { useAppSelector } from "../../redux/hooks";
import { handleTypesenseSearch } from "../../config/typesense";
import SearchTile2 from "../searchHeader/SearchTile";
import useDebounce from "../../utils/useDebounce";
import { Menu, Transition } from "@headlessui/react";
import SidebarDrawer from "./SidebarDrawer";
import { setCurrency } from "../../redux/slices/appSlice";
import ReactCountryFlag from "react-country-flag";
import { auth } from "../../config/firebase-config";
import useOnScreen from "../../utils/visibleElement";

const Navmobile = ({
  cookie,
  isClient,
  handleLogout,
  setShowLogin,
  closeLoginMenu,
}: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  const { currency } = useAppSelector((state: any) => state.appReducer);
  const isLoginOpen = useAppSelector(
    (state: any) => state.loginReducer.isLoginOpen
  );

  const dispatch = useDispatch();
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(cookie),
    enabled: isClient,
  });
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const pathname = usePathname();
  const matches2 = useMediaQuery("(max-width:785px)");
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

  const [isSearching, setIsSearching] = useState(false);

  async function fetchSearchedProducts() {
    setIsSearching(true);
    const res = await handleTypesenseSearch(debouncedSearch);
    if (res) {
      setSearchedProducts(res);
    }
    setIsSearching(false);
  }

  useEffect(() => {
    if (searchQuery === "") {
      setSearchedProducts([]);
    }
    if (debouncedSearch) {
      fetchSearchedProducts();
      // fetch(`/api/search?q=${debouncedSearch}`);
    }
  }, [debouncedSearch]);

  return (
    <div ref={ref}>
      <div
        className={`block md:hidden bg-black text-white py-1.5 lg:py-3 text-sm font-semibold w-full px-1.5 lg:px-2.5  ${
          !isVisible && "fixed z-50  "
        } ${pathname?.includes("/category") && "top-0"}`}
      >
        <div className="flex items-center   w-[93%] mx-auto justify-between gap-1">
          <a
            href={`tel:${storeData && storeData?.storePhone?.split("+91")[1]}`}
          >
            <div className="flex items-center gap-2">
              <FlatIcon className="flaticon-support text-lg md:text-xl" />
              <h4 className="lg:text-base text-sm">Customer Help</h4>
            </div>
          </a>

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
                    <Menu.Items className="z-50 absolute right-0 mt-2 top-full w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {allowedCountries &&
                        allowedCountries.map((val) => {
                          return (
                            <div className="px-1 py-1 " key={val + "-country"}>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => {
                                      localStorage.setItem(
                                        "currency",
                                        val?.currencyCode
                                      );
                                      dispatch(setCurrency(val?.currencyCode));
                                    }}
                                    className={`${
                                      active
                                        ? "bg-primary text-white"
                                        : "text-gray-900"
                                    } group flex w-full items-center rounded-md px-1 py-1 lg:px-2 lg:py-2 text-sm`}
                                  >
                                    <div className="flex w`-full gap-2 items-center">
                                      <ReactCountryFlag
                                        countryCode={val?.countryCode}
                                        svg
                                      />
                                      <p className="w-full line-clamp-1 text-left">
                                        {val?.countryName}
                                      </p>
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

      <div
        className={`text-center block md:hidden  ${
          matches2 ? "px-[5%]" : "px-[7%]"
        } border-b border-gray-200 shadow-sm ${
          !isVisible &&
          `fixed z-40 bg-white overflow-auto w-full flex justify-between ${
            pathname?.includes("/category") ? "top-[31px]" : "top-[32px]"
          } `
        }`}
      >
        {isSearchOpen && (
          <div
            className={`absolute  left-0 bg-white w-full h-[70px] ${
              !isVisible ? "top-0" : "top-[32px] "
            }sm:h-[80px] shadow-md flex items-center justify-center z-50`}
          >
            <div className="w-full h-full relative flex  items-center justify-center">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery("");
                    setSearchedProducts([]);
                    router.push(`/search?q=${searchQuery}`);
                  }
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className=" w-full h-full select-none outline-none pl-3 pr-10 "
              />
            </div>
            {searchQuery !== "" && searchedProducts?.length > 0 && (
              <div className="absolute z-50 px-4 top-full left-0 w-full h-fit  max-h-[40vh] flex flex-col gap-2 ">
                {searchQuery !== "" ? (
                  <div className="flex flex-col gap-1 sm:gap-2 bg-white  rounded-xl p-1 pb-2 shadow-lg max-h-[40vh] overflow-y-auto">
                    {searchedProducts?.map((product, idx) => {
                      return (
                        <div key={product?.id}>
                          <SearchTile2
                            setIsSearchOpen={setIsSearchOpen}
                            product={product}
                            key={product?.id}
                            idx={idx}
                            setSearchQuery={setSearchQuery}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}

            <div
              className="absolute top-0 right-0 px-4 flex flex-col items-center justify-center h-full"
              onClick={() => {
                setIsSearchOpen(false);
              }}
            >
              <FlatIcon className="flaticon-close" />
            </div>
          </div>
        )}

        <div className="flex items-center w-full  justify-between py-[10px]">
          <div
            onClick={(prev) => {
              setIsMobile(true);
              document.body.classList.add("no-scroll");
            }}
            className="w-1/3"
          >
            <FlatIcon className="flaticon-list text-xl sm:text-2xl " />
          </div>

          <div className="w-[130px] sm:w-[150px] ">
            <Link href={"/"}>
              <Image
                src={logo}
                alt="logo"
                height={1000}
                width={1000}
                // style={{ aspectRatio: "auto", width: "100px", height: "auto" }}
                className="w-full h-auto"
              />
            </Link>
          </div>
          <div className="flex justify-end items-center   sm:gap-2 gap-1 w-1/3">
            <div
              className="text-right sm:px-[10px] sm:py-[10px] px-[5px] py-[5px] rounded-md"
              onClick={() => {
                setIsSearchOpen(true);
              }}
            >
              <FlatIcon className={"flaticon-search text-xl sm:text-2xl "} />
            </div>

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
              <FlatIcon className={"flaticon-heart text-xl sm:text-2xl"} />
            </Link>

            <Link
              href={"/cart"}
              className="flex items-center  gap-2 relative z-0"
            >
              <FlatIcon className={"flaticon-cart   text-xl sm:text-2xl"} />
            </Link>
          </div>
        </div>
        {/* {isMobile && ( */}

        <SidebarDrawer
          dispatch={dispatch}
          userData={userData}
          isMobile={isMobile}
          setIsMobile={setIsMobile}
          pathname={pathname}
          cookie={cookie}
          handleLogout={handleLogout}
        />
        {/* )} */}
      </div>
    </div>
  );
};
export default Navmobile;
