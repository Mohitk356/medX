"use client"

import { FC } from 'react';
// import headingsectionimage from "../../images/Group 1";

interface Props {
  heading: string;
}

const Headersection: FC<Props> = ({ heading }) => {
  return (
    <div className='relative'>
      {/* <Image
        src={headingsectionimage}
        className="h-auto w-[100vw] object-cover"
        alt=""
        style={{
          maxWidth: "100%",
          height: "auto"
        }}></Image> */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className='text-lg text-white font-semibold text-center sm:mb-[20px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl'>{heading}</div>
        <div className='flex text-white gap-3 text-sm sm:text-sm md:text-lgbase lg:text-lg xl:text-xl justify-center items-center'>
          <p className=''>Home</p>
          <div className="rounded-full bg-[white] w-[10px] h-[10px]"></div>
          <p className=''>Vegetables</p>
          <div className="rounded-full bg-[white] w-[10px] h-[10px]"></div>
          <p className=''>{heading}</p>
        </div>
      </div>
    </div>
  );
}

export default Headersection;
