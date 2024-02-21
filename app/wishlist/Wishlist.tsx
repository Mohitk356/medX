"use client";

import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../components/categoryProduct/productCard";
import { fetchUserWishListProducts } from "../../utils/databaseService";
import logo from "../../images/logo.png";
import Image from "next/image";
import { CircularProgress } from "@mui/material";
import Modal from "../../components/Modal/modal";
import { useState } from "react";

const Wishlist = ({ cookie }) => {
  const { data: wishlist, isLoading} = useQuery({
    queryKey: ["wishlist-products"],
    queryFn: () => fetchUserWishListProducts(cookie),
    keepPreviousData: true,
    staleTime: 10000,
  });
  // console.log("wishlist",wishlist);
  // console.log("fgfdg",isFetching);
  
  
  const [isRemoving, setIsRemoving] = useState(false);
  return (
    <>
      <h1 className="px-body py-4 md:text-2xl font-semibold text-xl">
        My Wishlist
      </h1>
      {isLoading && !wishlist ? (
        <div className="w-full min-h-[30vh]  flex items-center justify-center ">
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
      ) : wishlist && wishlist?.length > 0 ? (
        <>
          <Modal isOpen={isRemoving} setOpen={setIsRemoving}>
            <div className="flex flex-col gap-2 justify-center items-center">
              <CircularProgress className="!text-white"></CircularProgress>
              <p className="text-white font-medium text-lg">
                Removing from wishlist.
              </p>
            </div>
          </Modal>
          <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 px-body py-6 gap-4">
            {wishlist &&
              wishlist.map((product) => {
                return (
                  <ProductCard
                    fromWishlist={true}
                    isRemoving={isRemoving}
                    setIsRemoving={setIsRemoving}
                    product={product}
                    cookie={cookie}
                  ></ProductCard>
                );
              })}
          </div>
        </>
      ) : (
        <div className="px-body min-h-[40vh] grid place-items-center">
          <h2 className="text-2xl font-semibold"> No products added</h2>
        </div>
      )}
    </>
  );
};

export default Wishlist;
