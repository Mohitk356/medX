// "use client";
// import React, { useState, useEffect, FC } from "react";
// import whiteLogo from "../../images/Group 3.svg";
// import Image from "next/image";
// import smallLeaf from "../../images/Group 34147.svg";
// import check from "../../images/Vector 28.svg";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../../config/firebase-config";
// import { doc, setDoc } from "firebase/firestore";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { RecaptchaVerifier } from "firebase/auth";
// import { signInWithPhoneNumber } from "firebase/auth";

// interface Props {
//   createAccountClickHandler?: any;
// }
// const LoginPage: FC<Props> = () => {
//   const [isChecked, setIsChecked] = useState(false);
//   const [email, setEmail] = useState<any>("");
//   const [password, setPassword] = useState<any>("");
//   const [phoneNumber, setPhoneNumber] = useState<any>("");
//   const [OTPModal, setOTPModal] = useState(false);
//   const [loginModal, setLoginModal] = useState(true);
//   const [time, setTime] = useState(60);
//   const [OTP, setOTP] = useState("");
//   const [timerStarted, setTimerStarted] = useState(false);
//   const [otpSent, setOTPSent] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [verifying, setVerifying] = useState(false);
//   const router = useRouter();

//   const handleCreateAccountClick = () => {
//     router.push("/signup"); // Replace 'signup' with your actual signup page route
//   };

//   const toggleCheckbox = () => {
//     setIsChecked(!isChecked);
//   };

//   const loginHandler = () => {
//     if (email && password) {
//       signInWithEmailAndPassword(auth, email, password)
//         .then(async (userCredential) => {
//           // Signed in
//           const user = userCredential.user;
//           await setDoc(
//             doc(db, "users", user.uid),
//             { lastAccessAt: new Date() },
//             { merge: true }
//           );
//           await axios.get(`/api/login?uid=${user.uid}`);
//           router.push("/");
//         })
//         .catch((error) => {
//           const errorCode = error.code;
//           const errorMessage = error.message;
//           if (error.code === "auth/wrong-password") {
//             console.log("wrong password");
//           } else if (error.code === "auth/user-not-found") {
//             console.log("New user please signup.");
//           } else {
//             console.log(errorMessage);
//           }
//         });
//     } else {
//       console.log("fill details");
//     }
//   };
//   // timer
//   useEffect(() => {
//     document.getElementById("otp1")?.focus();
//   }, [OTPModal]);

//   useEffect(() => {
//     setTimeout(() => {
//       if (timerStarted) {
//         if (time === 1) {
//           setTimerStarted(false);
//           confirmOTP();
//         }
//         setTime((t) => t - 1);
//       }
//     }, 1000);
//   }, [time]);
//   const startTimer = () => {
//     setTimerStarted(true);
//     setTime((t) => t - 1);
//   };
//   const signInUserWithPhoneNumber = async () => {
//     if (phoneNumber) {
//       setLoading(true);
//       const recaptchaVerifier = new RecaptchaVerifier(
//         auth,
//         "recaptcha-container",
//         {
//           size: "invisible",
//           callback: (response: any) => {
//             console.log(response);
//           },
//         }
//       );
//       const formattedPhoneNumber = `+91${phoneNumber}`;
//       await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier)
//         .then((confirmationResult) => {
//           // console.log("confirmationResult::::::::" ,confirmationResult );
//           setOTPSent(confirmationResult);
//           setLoginModal(false);
//           setOTPModal(true);
//           setLoading(false);
//           startTimer();
//         })
//         .catch((error) => {
//           console.log(error + "...please reload");
//           setLoading(false);
//         });
//     } else {
//       if (!phoneNumber) console.log("Please enter both name and phone number");
//       setLoading(false);
//     }
//   };

//   const confirmOTP = () => {
//     try {
//       setTimerStarted(false);
//       setVerifying(true);
//       otpSent
//         .confirm(OTP)
//         .then(async (res: any) => {
//           console.log(res, "User");
//           localStorage.setItem("auth", JSON.stringify(res.user.uid));
//           if (res._tokenResponse.isNewUser) {
//             let user = {
//               phoneNo: phoneNumber,
//               createdAt: new Date(),
//               active: true,
//               lastAccessAt: new Date(),
//               role: "user",
//               name: "",
//               email: email,
//               dP: "assets/img/user-pic.gif",
//               setFromUI: true,
//               wallet: { balance: 0, cashback: 0, lastTransactions: {} },
//             };
//             console.log(user, "user info");
//             await setDoc(doc(db, `users/${res.user.uid}`), user, {
//               merge: true,
//             });
//           } else {
//             console.log("user already exist");
//           }

//           await axios.get(`/api/login?uid=${res.user.uid}`);
//           setVerifying(false);

//           setOTPModal(false);
//           setLoginModal(true);
//           setTime(60);
//           setOTP("");
//           setTimerStarted(false);
//           setOTPSent(null);
//           setLoading(false);
//           router.replace("/");
//         })
//         .catch((err: any) => {
//           setOTPModal(false);
//           console.log("Incorrect OTP! Sign in failed!");
//         });
//     } catch (err) {
//       console.log("error ");
//     }
//   };

//   return (
//     <div className="bg-login-bg  bg-cover bg-no-repeat sm:px-[3.5%] px-[7%]">
//       <div className="flex justify-center  py-[10%] w-[90%] mx-auto">
//         <div className="bg-white  sm:px-[40px] px-[20px] sm:py-[50px] py-[20px]  rounded-xl relative  md:w-[45%] w-[100%] log-in">
//           <div className="font-bold sm:text-3xl text-xl mb-[30px]">Log In</div>
//           <div className="text-[#777777] text-sm mb-[30px]">
//             Please enter your details.
//           </div>
//           {/* code for login with email and password  */}
//           {/* <div className=" mb-[20px]">
//             <input
//               type="Email"
//               placeholder="Email"
//               className=" w-full  px-[20px] py-[5px] outline-0"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div> */}
//           {/* <div className="   mb-[20px]">
//             <input
//               type="text"
//               placeholder="Password"
//               className="  w-full px-[20px] py-[5px] outline-0"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div> */}
//           {/* <div className="flex   flex-grow sm:flex-row flex-col sm:gap-0 gap-5 py-[5px]  justify-between  mb-[40px] items-center font-medium sm:text-base text-sm">
//             <div className="flex items-center gap-3">
//               <div
//                 className={`w-5 h-5 border-2 rounded-sm cursor-pointer flex justify-center items-center ${
//                   isChecked
//                     ? "bg-[#62A403] border-[#62A403]"
//                     : "bg-white border-gray-400"
//                 }`}
//                 onClick={toggleCheckbox}
//               >
//                 {isChecked && (
//                   <Image
//                     src={check}
//                     alt=""
//                     style={{
//                       maxWidth: "100%",
//                       height: "auto",
//                     }}
//                   />
//                 )}
//               </div>
//               <div>Remember Me</div>
//             </div>
//             <div>Forgot Password?</div>
//           </div> */}
//           {/* code for login with email and password end  */}

//           {/* code for login with phone number start  */}
//           <div className="   mb-[20px]">
//             <input
//               type="text"
//               placeholder="Enter phone number"
//               className="  w-full px-[20px] py-[15px] outline-0 border border-gray-300 rounded-lg"
//               value={phoneNumber}
//               onChange={(e) => {
//                 setPhoneNumber(e.target.value);
//                 console.log(e.target.value);
//               }}
//             />
//           </div>
//           {/* code for login with email and password end  */}

//           <div
//             // onClick={loginHandler}
//             onClick={async () => {
//               await signInUserWithPhoneNumber();
//               setPhoneNumber("");
//             }}
//             className=" text-center bg-[#62A403] py-[12px] rounded-2xl text-[white] cursor-pointer"
//           >
//             {/* <div id="proceed"></div> */}
//             {loading ? "Sending Otp..." : "Log in"}
//           </div>
//           <div id="recaptcha-container"></div>
//           {/* code for login with email and password start  */}
//           {/* <div className="flex items-center justify-center gap-10 my-[20px]">
//             <div className="w-[25%] h-[0.2px] bg-[#dfdfdf]"></div>
//             <span className="text-gray-600 sm:text-base text-sm">OR</span>
//             <div className="w-[25%] h-px bg-[#dfdfdf]"></div>
//           </div> */}
//           {/* 
//           <div className="flex border-[1px] border-text-[#777777] items-center justify-center gap-3  py-[12px] mb-[40px]">
            
//             <div className="font-semibold sm:text-lg text-sm">
//               Log In with Google
//             </div>
//           </div> */}
//           {/* <div className="flex justify-center items-center gap-3 font-medium sm:text-base text-sm">
//             <div>Don&apos;t have an account? </div>
//             <Link
//               href={"/signup"}
//               // onClick={handleCreateAccountClick}
//               className="text-[#51150A] cursor-pointer"
//             >
//               Sign up
//             </Link>
//           </div> */}
//           {/* code for login with email and password end  */}

//           {OTPModal && (
//             <div className="h-[100vh] w-[100vw] bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 flex flex-col justify-center items-center z-30">
//               <div
//                 className={` p-[30px] rounded-md bg-white w-[550px] max-w-[93%] md:px-[100px] border-box relative modalAnimation`}
//               >
//                 <div
//                   onClick={() => setOTPModal(false)}
//                   className="bg-white cursor-pointer right-0 top-[-35px] rounded-full p-[2px] absolute"
//                 >
//                   cross icon
//                 </div>
//                 <h1 className="text-2xl md:text-3xl font-semibold text-center min-w-fit">
//                   Enter Verification Code
//                 </h1>
//                 <div className="text-[#ababab] text-sm mb-[20px] font-medium text-center">
//                   We have sent you a 6 digit OTP on ghgf{" "}
//                 </div>
//                 <div>{phoneNumber} gfdg</div>
//                 <div className="w-full flex justify-center items-center mb-[10px]">
//                   {[1, 2, 3, 4, 5, 6].map((digit, idx) => (
//                     <input
//                       key={idx}
//                       type="text"
//                       pattern="\d*"
//                       maxLength={1}
//                       className="m-[5px] md:m-[10px] p-[5px] md:p-[10px] caret-[#fb5353] outline-none border-2 rounded-md focus:border-[#21c93c] w-[35px] md:w-[50px] flex justify-center items-center text-center"
//                       id={`${"otp" + digit}`}
//                       onChange={(e) => {
//                         if (e.target.value) {
//                           document
//                             .getElementById(`${"otp" + (digit + 1)}`)
//                             ?.focus();
//                           let otp = OTP;
//                           setOTP(
//                             otp.substring(0, digit - 1) +
//                               e.target.value +
//                               otp.substring(digit)
//                           );
//                         } else {
//                           let otp = OTP;
//                           setOTP(
//                             otp.substring(0, digit - 1) +
//                               " " +
//                               otp.substring(digit)
//                           );
//                         }
//                       }}
//                     />
//                   ))}
//                 </div>
//                 <div className="text-[#21c93c] font-semibold mb-[30px] text-center">
//                   00:{time > 9 ? time : "0" + time}
//                 </div>
//                 <div
//                   onClick={() => confirmOTP()}
//                   className="bg-[#21c93c] w-full text-center  py-2 px-4 rounded-md text-white"
//                 >
//                   {verifying ? "Verifying Otp" : "Proceed"}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

"use client";
import React, { useState, useEffect, FC } from "react";

// import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";
import { useRouter } from "next/navigation";
// import Link from "next/link";
import { RecaptchaVerifier } from "firebase/auth";
import { signInWithPhoneNumber } from "firebase/auth";

interface Props {
  createAccountClickHandler?: any;
}
const LoginPage: FC<Props> = () => {
//  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState<any>("");
// const [password, setPassword] = useState<any>("");
  const [phoneNumber, setPhoneNumber] = useState<any>("");
  const [OTPModal, setOTPModal] = useState(false);
  const [loginModal, setLoginModal] = useState(true);
  const [time, setTime] = useState(60);
  const [OTP, setOTP] = useState("");
  const [timerStarted, setTimerStarted] = useState(false);
  const [otpSent, setOTPSent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();

  // const handleCreateAccountClick = () => {
  //   router.push("/signup"); // Replace 'signup' with your actual signup page route
  // };

  // const toggleCheckbox = () => {
  //   setIsChecked(!isChecked);
  // };

  // const loginHandler = () => {
  //   if (email && password) {
  //     signInWithEmailAndPassword(auth, email, password)
  //       .then(async (userCredential) => {
  //         // Signed in
  //         const user = userCredential.user;
  //         await setDoc(
  //           doc(db, "users", user.uid),
  //           { lastAccessAt: new Date() },
  //           { merge: true }
  //         );
  //         await axios.get(`/api/login?uid=${user.uid}`);
  //         router.push("/");
  //       })
  //       .catch((error) => {
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //         if (error.code === "auth/wrong-password") {
  //           console.log("wrong password");
  //         } else if (error.code === "auth/user-not-found") {
  //           console.log("New user please signup.");
  //         } else {
  //           console.log(errorMessage);
  //         }
  //       });
  //   } else {
  //     console.log("fill details");
  //   }
  // };
  // timer
  useEffect(() => {
    document.getElementById("otp1")?.focus();
  }, [OTPModal]);

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
    if (phoneNumber) {
      setLoading(true);
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response: any) => {
            console.log(response);
          },
        }
      );
      const formattedPhoneNumber = `+91${phoneNumber}`;
      await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          // console.log("confirmationResult::::::::" ,confirmationResult );
          setOTPSent(confirmationResult);
          setLoginModal(false);
          setOTPModal(true);
          setLoading(false);
          startTimer();
        })
        .catch((error) => {
          console.log(error + "...please reload");
          setLoading(false);
        });
    } else {
      if (!phoneNumber) console.log("Please enter both name and phone number");
      setLoading(false);
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
              phoneNo: phoneNumber,
              createdAt: new Date(),
              active: true,
              lastAccessAt: new Date(),
              role: "user",
              name: "",
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

          await axios.get(`/api/login?uid=${res.user.uid}`);
          setVerifying(false);

          setOTPModal(false);
          setLoginModal(true);
          setTime(60);
          setOTP("");
          setTimerStarted(false);
          setOTPSent(null);
          setLoading(false);
          router.replace("/");
        })
        .catch((err: any) => {
          setOTPModal(false);
          console.log("Incorrect OTP! Sign in failed!");
        });
    } catch (err) {
      console.log("error ");
    }
  };

  return (
    <div className=" sm:px-[3.5%] px-[7%]">
      <div className="flex justify-center  py-[10%] w-[90%] mx-auto">
        <div className="bg-white  sm:px-[40px] px-[20px] sm:py-[50px] py-[20px]  rounded-xl relative  md:w-[45%] w-[100%] log-in">
          <div className="font-bold sm:text-3xl text-xl mb-[30px]">Log In</div>
          <div className="text-[#777777] text-sm mb-[30px]">
            Please enter your details.
          </div>
         

          {/* code for login with phone number start  */}
          <div className="   mb-[20px]">
            <input
              type="text"
              placeholder="Enter phone number"
              className="  w-full px-[20px] py-[15px] outline-0 border border-gray-300 rounded-lg"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                console.log(e.target.value);
              }}
            />
          </div>
      

          <div
      
            onClick={async () => {
              await signInUserWithPhoneNumber();
              setPhoneNumber("");
            }}
            className=" text-center bg-primary py-[12px] rounded-2xl text-[white] cursor-pointer"
          >

            {loading ? "Sending Otp..." : "Log in"}
          </div>
          <div id="recaptcha-container"></div>
       

          {OTPModal && (
            <div className="h-[100vh] w-[100vw] bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 flex flex-col justify-center items-center z-30">
              <div
                className={` p-[30px] rounded-md bg-white w-[550px] max-w-[93%] md:px-[100px] border-box relative modalAnimation`}
              >
                <div
                  onClick={() => setOTPModal(false)}
                  className="bg-white cursor-pointer right-0 top-[-35px] rounded-full p-[2px] absolute"
                >
                  cross icon
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-center min-w-fit">
                  Enter Verification Code
                </h1>
                <div className="text-[#ababab] text-sm mb-[20px] font-medium text-center">
                  We have sent you a 6 digit OTP on ghgf{" "}
                </div>
                <div>{phoneNumber}</div>
                <div className="w-full flex justify-center items-center mb-[10px]">
                  {[1, 2, 3, 4, 5, 6].map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      pattern="\d*"
                      maxLength={1}
                      className="m-[5px] md:m-[10px] p-[5px] md:p-[10px] caret-[#fb5353] outline-none border-2 rounded-md focus:border-[#21c93c] w-[35px] md:w-[50px] flex justify-center items-center text-center"
                      id={`${"otp" + digit}`}
                      onChange={(e) => {
                        if (e.target.value) {
                          document
                            .getElementById(`${"otp" + (digit + 1)}`)
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
                    />
                  ))}
                </div>
                <div className="text-[#21c93c] font-semibold mb-[30px] text-center">
                  00:{time > 9 ? time : "0" + time}
                </div>
                <div
                  onClick={() => confirmOTP()}
                  className="bg-primary w-full text-center  py-2 px-4 rounded-md text-white"
                >
                  {verifying ? "Verifying Otp" : "Proceed"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

