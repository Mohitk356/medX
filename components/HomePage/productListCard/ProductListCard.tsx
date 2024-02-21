"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { constant } from "../../../utils/constants";
import {
  checkIfItemExistsInWishlist,
  checkIfPriceDiscounted,
  getDiscountedPercentage,
} from "../../../utils/utilities";
import officon from "../../../images/officon.svg";
import {
  addItemtoWishList,
  fetchUserWishList,
  removeItemFromWishList,
} from "../../../utils/databaseService";
import FlatIcon from "../../flatIcon/flatIcon";
import { useAppSelector } from "../../../redux/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AiFillHeart } from "react-icons/ai";
import { auth } from "../../../config/firebase-config";
import Modal from "../../Modal/modal";
import { CircularProgress } from "@mui/material";

const ProductListCard = ({
  product,
  prodId,
  setIsRemoving = null,
  setIsAdding = null,
}) => {
  const queryClient = useQueryClient();
  const { data: userWishList } = useQuery({
    queryKey: ["userWishlist"],
    queryFn: fetchUserWishList,
  });

  const [image, setImage] = useState(
    product?.coverPic && (product?.coverPic?.url || constant.errImage)
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  return (
    <>
      <div className="w-full bg-white py-2 md:py-4 px-body  hover:hover:shadow-productCarouselShadow hover:shadow-white   md:flex md:flex-col rounded-br-3xl cursor-pointer">
        <div className="flex items-center justify-between">
          {checkIfPriceDiscounted({
            discountedPrice: product?.discountedPrice,
            price: product?.prodPrice,
          }) ? (
            <div className="relative">
              <Image
                src={officon}
                alt="offer"
                width={70}
                height={70}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit text-xs  flex gap-1 text-white font-medium ">
                <span className="text-white">
                  {getDiscountedPercentage({
                    price: product?.prodPrice,
                    discountedPrice: product?.discountedPrice,
                  })}
                </span>
                <span className="text-white">OFF</span>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <div
            className="pr-1 pt-1 cursor-pointer"
            onClick={async () => {
              if (!auth.currentUser?.uid) return toast.error("Please Login.");

              if (!checkIfItemExistsInWishlist(userWishList, prodId)) {
                if (setIsAdding) setIsAdding(true);
                await addItemtoWishList(product, prodId);
                await queryClient.invalidateQueries({
                  queryKey: ["userWishlist"],
                });
                if (setIsAdding) setIsAdding(false);
                toast.success("Product Added to Wishlist");
              } else {
                if (setIsRemoving) setIsRemoving(true);
                await removeItemFromWishList(prodId);
                await queryClient.invalidateQueries({
                  queryKey: ["userWishlist"],
                });
                if (setIsRemoving) setIsRemoving(false);
                toast.success("Product Removed from Wishlist");
              }
            }}
          >
            {checkIfItemExistsInWishlist(userWishList, prodId) ? (
              <AiFillHeart className="text-primary" size={25} />
            ) : (
              <FlatIcon
                className={`flaticon-heart text-xl sm:text-xl md:text-2xl text-primary`}
              />
            )}
          </div>
        </div>
        <Link href={`/product/${product?.slug?.name}`}>
          {/* <div className="h-[160px] lg:h-[200px] p-2"> */}
          <div className="h-[160px] lg:h-[200px] p-2">
            <Image
              id={product?.id}
              src={image}
              onError={() => {
                setImage(constant.errImage);
              }}
              alt={product?.prodName || ""}
              width={1000}
              height={1000}
              className="w-full h-full object-contain"
            />
          </div>
          <div className=" md:py-1">
            <h4
              className="text-sm  md:text-base h-15 font-semibold line-clamp-2 text-ellipsis overflow-hidden ..."
              //truncate text-ellipsis overflow-hidden ...
            >
              {product?.prodName}
            </h4>
          </div>

          {/* {product?.rating && <div className="text-sm  ">Rating</div>} */}
          <div className="flex items-center mt-2 gap-2">
            <h3 className=" text-base md:text-lg font-bold">
              {isClient && currency}{" "}
              {isClient && (product?.discountedPrice * currRate)?.toFixed(2)}
            </h3>
            {checkIfPriceDiscounted({
              discountedPrice: product?.discountedPrice,
              price: product?.prodPrice,
            }) && (
              // <h6 className="text-[#ADADAD] line-through text-xs font-medium">
              //   {isClient && currency}{" "}
              //   {isClient && (product?.prodPrice * currRate)?.toFixed(2)}
              // </h6>
              <div className="text-ellipsis overflow-hidden ... truncate  ">
                <p className="text-ellipsis overflow-hidden ... truncate   line-through text-xs md:text-sm text-[#ADADAD]">
                  {isClient && currency}{" "}
                  {isClient && (product?.prodPrice * currRate)?.toFixed(2)}
                </p>
              </div>
            )}
            {/* <div className="text-ellipsis overflow-hidden ... truncate  ">
            <p className="text-ellipsis overflow-hidden ... truncate   line-through text-sm text-[#ADADAD]">
              {isClient && currency}{" "}
              {isClient && (product?.prodPrice * currRate)?.toFixed(2)}
            </p>
          </div> */}

            {/* <div
            className={`flex-1 flex flex-col justify-end ${
              hoveredProduct === product?.id ? "visible" : "invisible"
            }`}
          >
            <div className="w-full bg-highlight flex items-center justify-center py-2 mt-2 ">
              <h6 className="text-white"> Add To Cart</h6>
            </div>
          </div> */}
          </div>
        </Link>
      </div>
    </>
  );
};

export default ProductListCard;
