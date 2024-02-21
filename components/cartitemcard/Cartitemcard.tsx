"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { constant } from "../../utils/constants";
import { useDispatch } from "react-redux";
import {
  initializeCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";
import { useAppSelector } from "../../redux/hooks";
import { toast } from "react-toastify";
import Link from "next/link";
import { checkIfPriceDiscounted } from "../../utils/utilities";

const CartItemCard = ({
  item,
  mykey,
  selected = null,
  inputCalories,
  selectedTypeValue,
}) => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );
  useEffect(() => {
    setIsClient(true);
  }, []);

  let selectedLowerCase =
    (selected && selected === "Calories"
      ? "calorie"
      : selected?.toLowerCase()) || "";

  return (
    <div className="flex md:justify-between md:items-center md:flex-row flex-col ">
      <div className="md:flex-row flex-col flex md:items-center gap-1 sm:gap-2 md:gap-4 ">
        <div>
          <Link href={`/product/${item?.slug?.name}`}>
            <Image
              src={
                item?.img && item?.img?.toString()?.includes("assets/img")
                  ? constant?.errImage
                  : item?.img?.url || constant.errImage
              }
              alt={item?.name || "productalt"}
              width={215}
              height={215}
              className="object-contain"
            />
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          {item?.vendorName && (
            <p className="text-zinc-400 text-sm font-medium">
              By
              <span className="text-red-500 text-sm font-medium">
                {item?.vendorName}
              </span>
            </p>
          )}

          <div className="flex flex-col">
            <p className=" hover:cursor-pointer w-fit md:w-[400px] h-10 md:h-16 text-neutral-950 md:text-lg text-base font-semibold leading-[25px] tracking-tight ">
              <Link href={`/product/${item?.slug?.name}`}>{item.name}</Link>{" "}
            </p>
            <p className="text-sm text-gray-500">
              {item?.isPriceList ? item?.pack?.weight : ""}
            </p>
          </div>

          {/* <div className="flex items-center gap-1">
            <h2 className="text-primary text-xl">
              &#10027;&#10027;&#10027;&#10027;&#10027;
            </h2>
            <p className="text-zinc-400 text-xs font-medium">(27)</p>
          </div> */}

          <div className="md:flex-row flex flex-col md:items-center gap-4">
            <div className="w-[95px] h-9 bg-white border border-zinc-300 flex">
              <div
                className="w-64 flex-[0.5] flex justify-center items-center text-lg font-normal cursor-pointer select-none"
                onClick={async () => {
                  dispatch(
                    updateCartItemQuantity({
                      type: "dec",
                      addedQty: item?.minQty || null,
                      index: mykey,
                    })
                  );
                }}
              >
                -
              </div>
              <div className="w-10 flex justify-center items-center">
                <p className="text-black text-base font-bold leading-tight">
                  {item.quantity}
                </p>
              </div>
              <div
                className="w-7 flex-[0.5] flex justify-center items-center md:text-lg text-base font-normal cursor-pointer select-none"
                onClick={() => {
                  let currQty = item?.quantity;
                  if (item.isPriceList) {
                    if (
                      currQty + (item?.minQty || 1) >
                      parseFloat(item?.totalQty)
                    ) {
                      toast.error("Cannot add more of this item");
                    } else {
                      dispatch(
                        updateCartItemQuantity({
                          type: "inc",
                          addedQty: item?.minQty || null,
                          index: mykey,
                        })
                      );
                    }
                  } else {
                    if (
                      currQty + (item?.minQty || 1) >
                      parseFloat(item?.totalQty)
                    ) {
                      toast.error("Cannot add more of this item");
                    } else {
                      dispatch(
                        updateCartItemQuantity({
                          type: "inc",
                          addedQty: item?.minQty || null,
                          index: mykey,
                        })
                      );
                      // setQuantity((val) => val + (product?.minQty || 1));
                    }
                  }
                }}
              >
                +
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="md:text-center text-black md:text-xl text-base font-medium leading-[29px]">
                <>
                  {isClient && currency} {(item?.price * currRate)?.toFixed(2)}
                </>
              </p>

              {checkIfPriceDiscounted({
                discountedPrice: item?.price,
                price: item?.mrpPrice,
              }) && (
                <p className="text-ellipsis overflow-hidden ... truncate text-center text-xs  text-[#ADADAD] line-through  font-medium ">
                  {isClient && currency}{" "}
                  {(item?.mrpPrice * currRate).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:gap-20 mr-8">
        {selected && item?.intake && item?.intake[selectedLowerCase] ? (
          <p className="text-neutral-600 text-base sm:text-lg md:text-xl font-medium leading-[35px] tracking-tight mt-2">
            {selected}:{" "}
            <span className="text-black text-base sm:text-lg md:text-xl font-medium leading-[35px] tracking-tight">
              {item?.intake[selectedLowerCase]}/ Per Serving
            </span>
          </p>
        ) : (
          <></>
        )}
        <p
          className="text-[#FF0000] text-base font-semibold cursor-pointer"
          onClick={() => {
            dispatch(
              removeFromCart({
                product: item,
                productID: item.productId,
                index: mykey,
                isPriceList: item?.isPriceList,
              })
            );
          }}
        >
          Remove Item{" "}
          <span className="text-[#FF0000] w-[11px] h-[11.60px] relative text-base font-normal">
            ✖
          </span>
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;
