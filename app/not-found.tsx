"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../images/logo.png";

export default function NotFound() {
  const router = useRouter();

  router.push("/");

  return (
    <div className={`w-full min-h-[70vh]  flex items-center justify-center `}>
      <div className=" flex-col gap-2 w-[40%] md:w-[20%] h-auto">
        <Image
          src={logo}
          alt="logo"
          className=" breathing-animation"
          width={200}
          height={200}
          layout="responsive"
        />
      </div>
    </div>
    // <div className="min-h-[40vh] flex justify-center items-center gap-3 flex-col">
    //   <h2 className="text-2xl font-medium">404 -Not Found</h2>
    //   <p className="text-2xl font-medium">Could not find requested resource</p>
    // </div>
  );
}
