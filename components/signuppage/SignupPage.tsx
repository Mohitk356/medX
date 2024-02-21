"use client";
import React, { useState, FC } from "react";
import whiteLogo from "../../images/Group 3.svg";
import Image from "next/image";
import smallLeaf from "../../images/Group 34147.svg";
import check from "../../images/Vector 28.svg";
import { db, auth } from "../../config/firebase-config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import axios from "axios";

interface Props {
  redirectToLogin?: any;
}
const Signup: FC<Props> = () => {
  const router = useRouter();
  
  const [isChecked, setIsChecked] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  // const auth=getAuth()

  const redirectToLoginHandler = () => {
    router.push("/login");
  };

  const addUserToFirebase = async (user: any) => {
    // console.log(user.uid);
    // console.log(name);
    // console.log(email);

    console.log(
        {
            phoneNo: "",
            createdAt: new Date(),
            active: true,
            lastAccessAt: new Date(),
            role: "user",
            name: name,
            email: email,
            dP: "assets/img/user-pic.gif",
            setFromUI: true,
            wallet: {"balance": 0, "cashback": 0, 'lastTransactions': {}}
        }
      );
    
    await setDoc(
        doc(db, "users", user.uid),
        {
            phoneNo: "",
            createdAt: new Date(),
            active: true,
            lastAccessAt: new Date(),
            role: "user",
            name: name,
            email: email,
            dP: "assets/img/user-pic.gif",
            setFromUI: true,
            wallet: {"balance": 0, "cashback": 0, 'lastTransactions': {}}
          }
    );

   
  };
  const signupHandler = () => {
    if (email && password.length > 5 && name) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in

          const user = userCredential.user;
          await addUserToFirebase(user);
          await signInWithEmailAndPassword(auth, email, password)
            .then(async (val: any) => {
              await axios.get(`/api/login?uid=${user.uid}`);
              router.push("/");
            })
            .catch((e) => {
              router.push("/login");
            });
          // ...
        })
        .catch((error) => {
          console.log("User already exists. Please login 9999999");

          const errorCode = error.code;
          const errorMessage = error.message;

          console.log(error)
          // ..
        });
    } else {
      console.log("plase fill details ");
    }
  };

  return (
    <div className="bg-login-bg  bg-cover bg-no-repeat sm:px-[3.5%] px-[7%]">
      <div className=" flex justify-center  py-[10%] w-[90%] mx-auto">
        

        <div className="bg-white  px-[40px] py-[50px]  rounded-xl relative  md:w-[50%] w-[100%] create-account">
          
          <div className="font-bold sm:text-3xl text:xl mb-[30px]">
            Create an account
          </div>
          <div className="text-[#777777] text-sm mb-[30px]">
            Let’s get started!
          </div>
          <div className=" mb-[20px]">
            <input
              type="name"
              placeholder="Name"
              className=" w-full  px-[20px] py-[5px] outline-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className=" mb-[20px]">
            <input
              type="email"
              placeholder="Email"
              className=" w-full  px-[20px] py-[5px] outline-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="   mb-[20px]">
            <input
              type="text"
              placeholder="Password"
              className="  w-full px-[20px] py-[5px] outline-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div
            onClick={signupHandler}
            className=" text-center bg-[#62A403] py-[12px] rounded-2xl text-[white] cursor-pointer"
          >
            Create an account
          </div>
          <div className="flex items-center justify-center gap-10 my-[20px]">
            <div className="w-[25%] h-[0.2px] bg-[#dfdfdf]"></div>
            <span className="text-gray-600">OR</span>
            <div className="w-[25%] h-px bg-[#dfdfdf]"></div>
          </div>
          <div className="flex border-[1px] border-text-[#777777] items-center justify-center gap-3  py-[12px] mb-[40px]">
            
            <div className="font-semibold text-lg">Sign Up with Google</div>
          </div>
          <div className="flex justify-center items-center gap-3 font-medium text-base">
            <div>Don&apos;t have an account? </div>
            <div
              onClick={redirectToLoginHandler}
              className="text-[#51150A] cursor-pointer"
            >
              Log in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
