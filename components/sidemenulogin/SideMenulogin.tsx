"use client";
import { Menu, Transition } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { auth, db } from "../../config/firebase-config";
import logo from "../../images/logo.png";
import { closeLoginModal } from "../../redux/slices/loginModalSlice";
import { allCountries } from "../../utils/constants";
import { getCountries, getUserData } from "../../utils/databaseService";
import FlatIcon from "../flatIcon/flatIcon";

function SideMenuLogin({ isOpen, onClose, setShowLogin }) {
  const { data: allowedCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
    keepPreviousData: true,
  });

  const [email, setEmail] = useState<any>("");
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState<any>("");
  const [dialcountry, setdialcountry] = useState<any>(
    allCountries?.filter((val) => val.curr === "AED")[0]
  );
  const queryClient = useQueryClient();
  const [time, setTime] = useState(60);
  const [OTP, setOTP] = useState("");
  const [timerStarted, setTimerStarted] = useState(false);
  const [otpSent, setOTPSent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showPhoneNumberInput, setShowPhoneNumberInput] = useState(true);
  const pathName = usePathname();
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(null),
  });

  // console.log(allowedCountries);

  const router = useRouter();

  // useEffect(() => {
  //     document.getElementById("otp1")?.focus();
  //   }, [OTPModal]);

  useEffect(() => {
    setTimeout(() => {
      if (timerStarted) {
        if (time === 1) {
          setTimerStarted(false);
          confirmOTP();
        }
        setTime((t) => t - 1);
      }
    }, 1000);
  }, [time]);
  const startTimer = () => {
    setTimerStarted(true);
    setTime((t) => t - 1);
  };
  const signInUserWithPhoneNumber = async () => {
    try {
      if (phoneNumber) {
        setLoading(true);
        const recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response: any) => {
              // console.log(response);
            },
          }
        );
        const formattedPhoneNumber = `${dialcountry.code}${phoneNumber}`;
        // console.log(formattedPhoneNumber);
        await signInWithPhoneNumber(
          auth,
          formattedPhoneNumber,
          recaptchaVerifier
        )
          .then((confirmationResult) => {
            // console.log("confirmationResult::::::::" ,confirmationResult );
            setOTPSent(confirmationResult);

            setLoading(false);
            startTimer();
          })
          .catch((error) => {
            console.log(error + "...please reload");
            setLoading(false);
          });
      } else {
        if (!phoneNumber)
          console.log("Please enter both name and phone number");
        setLoading(false);
      }
    } catch (error) {
      console.log("CATCH ERROR ", error);
    }
  };

  const confirmOTP = () => {
    try {
      setTimerStarted(false);
      setVerifying(true);
      otpSent
        .confirm(OTP)
        .then(async (res: any) => {
          console.log(res, "User");
          localStorage.setItem("auth", JSON.stringify(res.user.uid));
          if (res._tokenResponse.isNewUser) {
            let user = {
              phoneNo: dialcountry.code + phoneNumber,
              createdAt: new Date(),
              active: true,
              lastAccessAt: new Date(),
              role: "user",
              name: "",
              metaData: {
                source: "web",
              },
              email: email,
              dP: "assets/img/user-pic.gif",
              setFromUI: true,
              wallet: { balance: 0, cashback: 0, lastTransactions: {} },
            };
            console.log(user, "user info");
            await setDoc(doc(db, `users/${res.user.uid}`), user, {
              merge: true,
            });
          } else {
            console.log("user already exist");
          }

          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/login?uid=${res.user.uid}`
            );
          } catch (error) {
            console.log("LOGIN ERROR", error);
          }
          await queryClient.invalidateQueries({ queryKey: ["userData"] });
          await queryClient.refetchQueries({ queryKey: ["userData"] });
          setVerifying(false);
          dispatch(closeLoginModal());
          router.replace(pathName);
          document.body.classList.remove("no-scroll");
          toast.success("Login Successful");
          setTime(60);
          setOTP("");
          setTimerStarted(false);
          setOTPSent(null);
          setLoading(false);
        })
        .catch((err: any) => {
          console.log("Incorrect OTP! Sign in failed!");
          toast.error("Incorrect OTP!");
        });
    } catch (err) {
      console.log("error ", err);
      toast.error("Error Occured");
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 z-20 overscroll-y-auto">
      <div
        className={`fixed right-0 top-0 h-[100vh] z-20  sm:w-[340px] md:w-[400px] lg:w-[460px] w-full bg-white transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform ease-in-out duration-700`}
      >
        <div className="flex items-center justify-end p-4">
          <div
            className="mt-2 md:mt-4 mr-3 md:mr-6 bg-[#F6F3FA] rounded-full p-2 sm:p-2 md:p-3"
            onClick={onClose}
          >
            <FlatIcon className="text-gray-600 cursor-pointer flaticon-close text-xs sm:text-sm md:text-base" />
          </div>
        </div>
        <div className="p-4 flex flex-col items-center justify-center h-[85%] w-full ">
          <Image
            src={logo}
            alt="logo"
            width={1000}
            height={1000}
            // layout="responsive"
            className="flex w-[60%] md:w-[70%]   "
            //  style={{
            //   maxWidth: "100%",
            //   height: "auto",
            // }}
          />
          {/* <div className="font-bold sm:text-3xl text-xl mb-[30px]">Log In</div> */}
          <div className="text-[#777777] text-center text-sm sm:text-base md:text-lg lg:text-xl my-[30px]">
            Login with your Phone Number.
          </div>

          {/* code for login with phone number start  */}
          {showPhoneNumberInput && (
            <div className="w-[90%] mb-[20px] ">
              <div className="flex w-full ">
                <Menu
                  as="div"
                  className="w-[28%] relative text-left flex justify-center items-center  "
                >
                  <div className="flex justify-center items-center w-full">
                    <Menu.Button className="w-full px-[4px] sm:px-[6px] md:px-[8px] lg:px-[10px] py-[9px] sm:py-[11px] md:py-[13px] lg:py-[15px]   mb-[15px]  bg-gray-100 border  border-gray-100  ">
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
                                  }}
                                  className={`${
                                    active
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
                  type="text"
                  placeholder="Enter phone number"
                  className="w-[72%] px-[5px] sm:px-[10px] md:px-[15px] lg:px-[20px] py-[9px] sm:py-[11px] md:py-[13px] lg:py-[15px] mb-[15px] outline-0 border border-gray-300 rounded-br-[10px] lg:text-base md:text-sm text-xs"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    // console.log(e.target.value);
                  }}
                />
              </div>

              {/* code for login with phone number start  */}
              {showPhoneNumberInput && ( // Conditionally render phone number input and login button
                <>
                  <div className=" ">
                    <div
                      onClick={async () => {
                        await signInUserWithPhoneNumber();

                        setShowPhoneNumberInput(false); // Hide phone number input and login button
                      }}
                      className="text-center  bg-primary w-full py-[9px] sm:py-[11px] md:py-[13px] lg:py-[15px] rounded-br-[10px] text-[white] cursor-pointer lg:text-base md:text-sm text-xs"
                    >
                      {loading ? "Sending Otp..." : "Log in"}
                    </div>
                    <div id="recaptcha-container"></div>
                  </div>

                  <div className=" mt-2">
                    <div
                      onClick={async () => {
                        sessionStorage.setItem("guestLogin", "guest");
                        dispatch(closeLoginModal());
                        document.body.classList.remove("no-scroll");

                        // Hide phone number input and login button
                      }}
                      className="text-center  bg-gray-400 w-full py-[9px] sm:py-[11px] md:py-[13px] lg:py-[15px] rounded-br-[10px] text-white font-semibold cursor-pointer lg:text-base md:text-sm text-xs"
                    >
                      Log in as Guest
                    </div>
                    <div id="recaptcha-container"></div>
                  </div>
                </>
              )}
            </div>
          )}

          {!showPhoneNumberInput && ( // Conditionally render OTP input and verify OTP button
            <div className="mb-[20px] w-[90%]">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-[5px] sm:px-[10px] md:px-[15px] lg:px-[20px] py-[9px] sm:py-[11px] md:py-[13px] lg:py-[15px] mb-[15px] outline-0 border border-gray-300 rounded-br-[10px] lg:text-base md:text-sm text-xs"
                id="otp"
                value={OTP}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setOTP(inputValue);
                }}
              />
              <div
                onClick={() => {
                  confirmOTP();
                  setPhoneNumber("");
                }}
                className="text-center bg-primary w-full py-[9px] sm:py-[11px] md:py-[13px] lg:py-[15px] rounded-br-[10px] text-[white] cursor-pointer lg:text-base md:text-sm text-xs"
              >
                {verifying ? "Verifying Otp" : "Proceed"}
              </div>
            </div>
          )}

          {/* <div className="   mb-[20px] w-[90%]">
            <input
              type="text"
              placeholder="Enter phone number"
              className="  w-full px-[20px] py-[15px] mb-[15px] outline-0 border border-gray-300 rounded-br-[10px]"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                console.log(e.target.value);
              }}
            /> */}

          {/* <input
            
              type="text"
              placeholder="Enter otp"
              className="  w-full px-[20px] py-[15px] outline-0 border border-gray-300 rounded-br-[10px]"
                       
            id={"otp"}
            onChange={(e) => {
              if (e.target.value) {
                document
                  .getElementById("otp")
                  ?.focus();
                let otp = OTP;
                setOTP(
                  otp.substring(0, digit - 1) +
                    e.target.value +
                    otp.substring(digit)
                );
              } else {
                let otp = OTP;
                setOTP(
                  otp.substring(0, digit - 1) +
                    " " +
                    otp.substring(digit)
                );
              }
            }}
          /> */}

          {/* <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-[20px] py-[15px]  outline-0 border border-gray-300 rounded-br-[10px]"
            id="otp"
            value={OTP}
            onChange={(e) => {
            const inputValue = e.target.value;
            // Update OTP when the input value changes
            setOTP(inputValue);
            }}
            />


         </div> */}

          {/* <div
      
            onClick={async () => {
              await signInUserWithPhoneNumber();
              setPhoneNumber("");
            }}
            className=" text-center bg-primary  w-[90%] py-[15px] rounded-br-[10px] text-[white] cursor-pointer"
          >

            {loading ? "Sending Otp..." : "Log in"}
          </div> */}

          {/* <div
                  onClick={() => confirmOTP()}
                  className=" text-center bg-primary  w-[90%] py-[15px] rounded-br-[10px] text-[white] cursor-pointer"
                >
                  {verifying ? "Verifying Otp" : "Proceed"}
                </div> */}
        </div>

        {/* {OTPModal && (
            <div className="h-[100vh] w-[100vw] bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 flex flex-col justify-center items-center z-30">
              <div
                className={` p-[30px] rounded-md bg-white w-[550px] max-w-[93%] md:px-[100px] border-box relative modalAnimation`}
              >
             
                <div className="w-full flex justify-center items-center mb-[10px]">
                
                    
                </div>
                <div className="text-[#21c93c] font-semibold mb-[30px] text-center">
                  00:{time > 9 ? time : "0" + time}
                </div>
                
              </div>
            </div>
          )} */}
      </div>
    </div>
  );
}

export default SideMenuLogin;
