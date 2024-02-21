import Image from "next/image";
import React, { useState } from "react";
import FlatIcon from "../../flatIcon/flatIcon";
import { CircularProgress } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../config/firebase-config";
import { toast } from "react-toastify";

const MuscleShowNewsletter = ({ myKey, section }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);

  async function submitNewsLetter() {
    try {
      if (!email) {
        toast.error("Enter Email");
        return;
      }
      setLoading(true);
      await addDoc(collection(db, "newsletter"), {
        createdAt: new Date(),
        email: email,
      });
      toast.success("Subscribed!");
      setEmail('')
      setLoading(false);
    } catch (error) {
    console.log(error);
    
      toast.error("Something Went Wrong.");
      setLoading(false);
    }
  }

  return (
    <div
      className={`bg-[#FFEFF0] py-4 px-body relative lg:min-h-[500px] items-center flex justify-between `}
    >
      <div className="flex flex-col justify-center h-full py-4  w-full md:w-[50%] min-h-[240px] lg:min-h-[300px] gap-2">
        <h2 className="font-semibold text-2xl lg:text-3xl">Subscribe to </h2>
        <h2 className="text-primary font-bold text-2xl lg:text-5xl">
          Our Newsletter{" "}
        </h2>

        <div className="mt-2">
          <p>
            Sign up for weekly educational emails on all things health and
            fitness. Our goal is to help you learn the best ways to improve on
            your fitness journey every week!
          </p>
          <p>
            When you sign up you'll also be notified about new products,
            athletes, announcements and more!
          </p>
        </div>

        <div className="mt-4 w-full relative border border-primary rounded-lg">
          <input
            type="email"
            name=""
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            id=""
            className="w-[82%] lg:w-[78%] rounded-lg py-2 lg:py-4 bg-[#FFEFF0] pl-3 outline-none"
            placeholder="Email address"
          />
          <div className="absolute justify-end  w-[15%] lg:w-[20%] rounded-lg p-2 right-0 top-0 bottom-0 h-full flex items-center">
            <button
              onClick={() => {
                if (isLoading) return;

                submitNewsLetter();
              }}
              className="bg-primary rounded-lg lg:px-3 lg:h-full flex justify-center items-center"
            >
              {isLoading ? (
                <CircularProgress className="!text-white" size={25} />
              ) : (
                <FlatIcon className="flaticon-arrow-right text-2xl text-white p-1"></FlatIcon>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className=" w-[50%] h-full md:flex hidden  justify-end px-body items-center ">
        <div className="">
          <Image
            src={require("../../../images/newsletter.png")}
            alt="newsletter"
          />
        </div>
      </div>
    </div>
  );
};

const MemoizedNewsLetter = React.memo(MuscleShowNewsletter);

export default MemoizedNewsLetter;
