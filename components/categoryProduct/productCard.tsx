"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  checkIfItemExistsInWishlist,
  checkIfPriceDiscounted,
  getDiscountedPercentage,
} from "../../utils/utilities";
import { constant } from "../../utils/constants";
import Link from "next/link";
import { useMediaQuery } from "@mui/material";
import discountBg from "../../images/Vector (2).svg";
import btnBg from "../../images/image (8).png";
import {
  addItemtoWishList,
  fetchUserWishList,
  removeItemFromWishList,
} from "../../utils/databaseService";
import FlatIcon from "../flatIcon/flatIcon";
import { useAppSelector } from "../../redux/hooks";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AiFillHeart } from "react-icons/ai";

const ProductCard = ({
  product,
  idx = Math.random(),
  hideHover = false,
  isRemoving,
  setIsRemoving,
  fromWishlist = false,
}: any) => {
  const queryClient = useQueryClient();
  const { data: userWishList } = useQuery({
    queryKey: ["userWishlist"],
    queryFn: fetchUserWishList,
  });

  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getImage(product: any) {
    if (
      product?.coverPic &&
      product?.coverPic?.url &&
      !product?.coverPic?.url?.includes("assets/img")
    ) {
      return product?.coverPic?.url;
    }
    if (
      product?.images &&
      product?.images[0]?.url &&
      !product?.images[0]?.url?.includes("assets/img")
    ) {
      return product?.images[0]?.url;
    }
    return constant?.errImage;
  }

  const [image, setImage] = useState(getImage(product));
  const matchesSm = useMediaQuery("(min-width:640px)");

  const [hoveredProduct, setHoveredProduct] = useState("");
  // console.log(product?.slug?.name,"slug name");

  useEffect(() => {
    setImage(getImage(product));
  }, [product]);

  return (
    <>
      <div
        className={`h-full relative flex flex-col sm:gap-1 md:gap-2  py-2 cursor-pointer lg:hover:shadow-productShadow hover:rounded-lg`}
        key={product?.id || idx || Math.random().toString()}
        onMouseEnter={() => {
          setHoveredProduct(product?.id);
        }}
        onMouseLeave={() => {
          setHoveredProduct("");
        }}
      >
        <div className="absolute z-10 top-[10px]  w-full sm:px-2 hidden md:flex justify-between  text-white">
          {checkIfPriceDiscounted({
            discountedPrice: product?.discountedPrice,
            price: product?.prodPrice,
          }) ? (
            <div className="relative ">
              <Image src={discountBg} alt="bg-discount" className=" h-5 sm:h-10  " />
              <div className="absolute top-1/3 sm:top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit flex gap-1 text-xs">
                <p className="text-xs sm:text-sm ">
                  {getDiscountedPercentage({
                    price: product?.prodPrice,
                    discountedPrice: product?.discountedPrice,
                  })}
                </p>
                <p className="text-xs sm:text-sm ">OFF</p>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <div
            className="pr-1 pt-1 cursor-pointer"
            onClick={async () => {
              if (!checkIfItemExistsInWishlist(userWishList, product?.id)) {
                await addItemtoWishList(product, product?.id);
                await queryClient.invalidateQueries({
                  queryKey: ["wishlist-products"],
                });
                queryClient.invalidateQueries({
                  queryKey: ["userWishlist"],
                });
                toast.success("Product Added to Wishlist");
              } else {
                if (setIsRemoving) setIsRemoving(true);
                await removeItemFromWishList(product?.id);
                await queryClient.invalidateQueries({
                  queryKey: ["wishlist-products"],
                });
                await queryClient.refetchQueries({ queryKey: ["wishlist-products"] });
                queryClient.invalidateQueries({
                  queryKey: ["userWishlist"],
                });
                await queryClient.refetchQueries({ queryKey: ["userWishlist"] });
                if (setIsRemoving) setIsRemoving(false);

                toast.success("Product Removed from Wishlist");
              }
            }}
          >
            {checkIfItemExistsInWishlist(userWishList, product?.id) ? (
              <AiFillHeart className="text-primary" size={25} />
            ) : (
              <FlatIcon
                className={`flaticon-heart text-base sm:text-xl md:text-2xl text-primary`}
              />
            )}
          </div>
        </div>
        <Link href={`/product/${product?.slug?.name}`} className="relative">
          <div className=" relative  mb-2">
            <div className="h-[150px] sm:h-[150px] md:h-[150px] xl:h-[250px] relative ">
              <Image
                id={product?.id}
                src={image}
                alt={product?.prodName}
                onError={() => {
                  setImage(constant.errImage);
                }}
                width={1000}
                height={1000}
                className="w-full h-full object-fit"
              />
            </div>
          </div>

          <div className="text-ellipsis overflow-hidden ... truncate text-center px-2 ">
            <h4 className=" text-[#666666] text-ellipsis overflow-hidden text-xs sm:text-sm md:text-base font-medium ...">
              {product?.prodName}
            </h4>
          </div>
          {/* {product?.rating && <div className="text-center">Rating</div>}
        <div className="flex gap-2 items-center justify-center overflow-hidden  w-full  text-center mb-1">
          <h2 className="text-primary">
            {" "}
            &#10027;&#10027;&#10027;&#10027;&#10027;{" "}
          </h2>
          <p className="text-[#ADADAD] text-xs md:text-sm">(10)</p>
        </div> */}
          <div className="flex items-center justify-center gap-2   mb-2">
            <p className="text-ellipsis overflow-hidden ... truncate text-center   text-base font-bold ">
              {isClient && currency}{" "}
              {product?.isPriceList
                ? (product?.priceList[0]?.discountedPrice * currRate)?.toFixed(
                    2
                  )
                : (product?.discountedPrice * currRate)?.toFixed(2)}
            </p>
            {checkIfPriceDiscounted({
              discountedPrice: product?.isPriceList
                ? product?.priceList[0]?.discountedPrice
                : product?.discountedPrice,
              price: product?.isPriceList
                ? product?.priceList[0]?.price
                : product?.prodPrice,
            }) && (
              <p className="text-ellipsis overflow-hidden ... truncate text-center text-xs  text-[#ADADAD] line-through  font-medium ">
                {isClient && currency}{" "}
                {product?.isPriceList
                  ? (product?.priceList[0]?.price * currRate)?.toFixed(2)
                  : (product?.prodPrice * currRate).toFixed(2)}
              </p>
            )}
          </div>
          {/* <div className="text-center">fghgjghj</div>
        <div className="flex justify-center    text-base font-semibold mb-1 ">
        <h2 className="text-center">Calcium Magnesium Zinc Vitamin D3 & B 12 Tablets</h2>
      </div>
      <div className="flex gap-2 items-center justify-center overflow-hidden  w-full mb-1.5 text-center ">
        <h2 className="text-primary">	&#10027;&#10027;&#10027;&#10027;&#10027; </h2>
        <p className="text-[#ADADAD] text-sm">(10)</p>
      </div>
     <div className="flex gap-3 items-center justify-center"><h3 className=" text-lg font-semibold">265 AED</h3><h6 className="text-[#ADADAD] line-through text-xs font-medium">4354.78 AED</h6></div> */}
          {/* {matchesSm && !hideHover && (
          <div
            className={`flex justify-center items-center absolute left-0 bottom-0 w-full h-[45px] ${
              hoveredProduct === product?.id ? "visible" : "invisible"
            }`}
          >
            <Image
              src={btnBg}
              alt=""
              width={1000}
              height={1000}
              className="w-full h-full object-fit "
            />
            <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-full text-center">
              Add to Cart
            </h2>
          </div>
        )} */}
        </Link>
      </div>
    </>
  );
};

export default ProductCard;
