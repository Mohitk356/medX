import React from "react";
import logo from "../../images/logo.png";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="w-full min-h-[60vh]  flex items-center justify-center ">
      {/* <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div> */}

      <div className=" flex-col gap-2 w-[40%] md:w-[20%] h-auto">
            <Image
              src={logo}
              alt="loading"
              className=" breathing-animation"
              width={200}
              height={200}
              layout="responsive"
            />
            {/* <p className="text-center">Loading...</p> */}
          </div>
      
    </div>
  );
};

export default Loader;
