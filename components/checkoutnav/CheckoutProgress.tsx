export default function CheckoutProgress() {
  return (
    <div className="flex flex-col items-center justify-center mt-3 ">
      <div className="flex  flex-row   items-center w-[83%]">
        <div className="bg-red-500  w-[16%] h-0.5 "></div>
        <div className="flex justify-center items-center w-5 sm:w-6 md:w-7 m-2 h-5 sm:h-6 md:h-7 bg-[#444444] rounded-full">
          <p className=" font-semibold text-xs sm:text-sm md:text-base text-white p-3">
            1
          </p>
        </div>
        <div className="bg-red-500  w-[32%] h-0.5 "></div>
        <div className="flex justify-center items-center w-5 sm:w-6 md:w-7 m-2 h-5 sm:h-6 md:h-7 bg-[#444444] rounded-full">
          <p className=" font-semibold text-xs sm:text-sm md:text-base text-white p-3">
            2
          </p>
        </div>
        <div className="bg-[#444444] w-[32%] h-0.5 "></div>
        <div className="flex justify-center border-[#2b2b2b] border items-center w-5 sm:w-6 md:w-7 m-2 h-5 sm:h-6 md:h-7  rounded-full">
          <p className=" font-semibold text-xs sm:text-sm md:text-base p-3">3</p>
        </div>
        <div className="bg-[#444444]  w-[16%] h-0.5"></div>
      </div>

      <div className="flex flex-row justify-around w-[80%]">
        <p className=" font-semibold text-xs sm:text-sm md:text-base text-center">
          Shopping Cart
        </p>
        <p className=" font-semibold text-xs sm:text-sm md:text-base text-center ">
          Shipping and Checkout
        </p>
        <p className=" font-semibold text-xs sm:text-sm md:text-base text-center ">
          Confirmation
        </p>
      </div>
    </div>
  );
}
