"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateUserDetails } from "../../utils/databaseService";
import { useQueryClient } from "@tanstack/react-query";

const PersonalInfo = (userData) => {
  const queryClient = useQueryClient();
  let userinfo = userData?.userdata;

  const [state, setState] = useState({
    // {userData&&userData.name? userData.name: " " }
    fname: userData && userinfo?.name ? userinfo.name : "",
    // lastname: userData&&userData.name? userData.name: "",
    gender: userData && userinfo?.gender ? userinfo.gender : "",
    // age: userData&&userData.age? userData.age: "",
    email: userData && userinfo?.email ? userinfo.email : "",
    mobileno: userData && userinfo?.phoneNo ? userinfo.phoneNo : "",
  });

  const handleChange = ({ name, value }: any) => {
    setState((val) => {
      return { ...val, [name]: value };
    });
  };

  const handleSubmit = async () => {
    const updatedUserData = {
      name: state.fname,
      // lastname: state.lastname,
      gender: state.gender,
      // age:state.age,
      email: state.email,
      mobileno: state.mobileno,
    };

    try {
      updateUserDetails(updatedUserData);
      setState({
        fname: state.fname,
        // lastname: state.lastname,
        gender: state.gender,
        // age:state.age,
        email: state.email,
        mobileno: state.mobileno,
      });
      await queryClient.invalidateQueries({ queryKey: ["userData"] });
      toast.success("Details Saved");
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-10 lg:gap-16">
      <div className="flex flex-col md:flex-row gap-4 md:gap-10 lg:gap-16 ">
        <div className="w-full">
          <h1 className="text-sm md:text-base font-normal md:mb-1 text-neutral-400  uppercase">
            Name
          </h1>
          <div className=" w-[100%]  ">
            <input
              type="text"
              name="fname"
              onChange={(e) => {
                handleChange({ name: e.target.name, value: e.target.value });
              }}
              value={state.fname}
              className=" w-full h-6 sm:h-8 md:h-10 pb-1 border-b-2  border-neutral-300 focus:outline-none focus:border-neutral-500 text-sm md:text-base font-semibold"
              required
            />
          </div>
        </div>

        <div className="w-full">
          <h1 className="text-sm md:text-base font-normal md:mb-1 text-neutral-400 uppercase">
            Email
          </h1>
          <div className=" w-[100%] rounded-md">
            <input
              type="email"
              name="email"
              onChange={(e) => {
                handleChange({ name: e.target.name, value: e.target.value });
              }}
              value={state.email}
              className="w-full h-6 sm:h-8 md:h-10 pb-1 border-b-2  border-neutral-300 focus:outline-none focus:border-neutral-500 text-sm md:text-base font-semibold"
              required
            />
          </div>
        </div>

        {/* <div className="w-full">
      <h1 className="text-sm md:text-base font-normal md:mb-1 text-neutral-400 uppercase">Last Name</h1>
      <div className=" w-[100%]  rounded-md ">
        <input
         type="text"
          name="lastname"
          onChange={(e) => {
            handleChange({ name: e.target.name, value: e.target.value });
          }}
          value={state.lastname}
          className=" w-full h-6 sm:h-8 md:h-10 pb-1 border-b-2  border-neutral-300 focus:outline-none focus:border-neutral-500 text-sm md:text-base font-semibold"
          required
        />
      </div>
    </div> */}
      </div>

      {/* <div className="flex flex-col md:flex-row gap-4 md:gap-10 lg:gap-16"> */}

      {/* <div className="w-full">
      <h1 className="text-sm md:text-base font-normal md:mb-1 text-neutral-400 uppercase">Age</h1>
      <div className=" w-[100%] rounded-md">
        <input
          type="date"
          name="age"
          onChange={(e) => {
            handleChange({ name: e.target.name, value: e.target.value });
          }}
          value={state.age}
          className="w-full h-6 sm:h-8 md:h-10 pb-1 border-b-2  border-neutral-300 focus:outline-none focus:border-neutral-500 text-sm md:text-base font-semibold"
          required
        />
      </div>
    </div> */}

      {/* </div> */}

      <div className="flex flex-col md:flex-row gap-4 md:gap-10 lg:gap-16 ">
        <div className="w-full">
          <h1 className="text-sm md:text-base font-normal md:mb-1 text-neutral-400  uppercase">
            Mobile Number
          </h1>
          <div className=" w-[100%] rounded-md">
            <input
              type="text"
              name="mobileno"
              disabled
              onChange={(e) => {
                handleChange({ name: e.target.name, value: e.target.value });
              }}
              value={state.mobileno}
              className="w-full h-6 sm:h-8 md:h-10 pb-1 border-b-2  border-neutral-300 focus:outline-none focus:border-neutral-500 text-sm md:text-base font-semibold"
              required
            />
          </div>
        </div>
        <div className="w-full">
          <h1 className="text-sm md:text-base font-normal md:mb-1 text-neutral-400 uppercase">
            Gender
          </h1>
          <div className=" w-[100%]   rounded-md">
            <select
              name="gender"
              onChange={(e) => {
                handleChange({ name: e.target.name, value: e.target.value });
              }}
              value={state.gender}
              className="w-full h-6 sm:h-8 md:h-10 pb-1 border-b-2  border-neutral-300 focus:outline-none focus:border-neutral-500 text-sm md:text-base font-semibold"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="transgender">Transgender</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end">
        <div
          onClick={handleSubmit}
          className=" w-[47%] h-[45px] sm:h-[50px] md:h-[55px] lg:h-[60px] cursor-pointer bg-[#E64040]  border-2 hover:cursor-pointer  hover:border-[#E64040] hover:bg-white rounded-br-[10px] "
        >
          <h1 className="w-full h-full text-sm sm:text-base md:text-lg text-white  hover:text-[#E64040]  font-medium flex items-center justify-center">
            Save Changes
          </h1>
        </div>
      </div>
    </div>
  );
};
export default PersonalInfo;
