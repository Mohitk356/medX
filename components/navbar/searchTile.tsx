"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { constant } from "../../utils/constants";
import {
  checkIfItemExistInCart,
  checkIfPriceDiscounted,
  checkIfProductQuanityIsAvailable,
  getProductFromCart,
  getProductIndexFromCart,
} from "../../utils/utilities";
import FlatIcon from "../flatIcon/flatIcon";
import { useAppSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import {
  addToCart,
  getCartObj,
  getPriceListCartObj,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";
import { addCartObjToUser } from "../../utils/databaseService";
import { auth } from "../../config/firebase-config";
import { toast } from "react-toastify";

const SearchTile = ({
  product,
  idx,
  setSearchQuery,
  setIsSearchOpen,
  setIsLogoVisible,
}) => {
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const cart = useAppSelector((state) => state.cartReducer.cart);
  const dispatch = useDispatch();

  async function addItemToCart(product) {
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    let data: any = {
      product,
      productID: product?.id,
      quantity: product?.minQty || 1,
      index: 0,
      isPriceList: product?.isPriceList,
    };

    try {
      const cartObject = data.isPriceList
        ? getPriceListCartObj({
            product: product,
            quantity: product?.minQty || 1,
            index: data.index,
          })
        : getCartObj({
            product: product,
            productID: data?.productID,
            quantity: data?.quantity,
          });
      if (auth.currentUser) {
        const docId = await addCartObjToUser(cartObject);
        cartObject["id"] = docId;
      }
      dispatch(addToCart(cartObject));
      setIsAddingToCart(false);
    } catch (error) {
      setIsAddingToCart(false);
    }
  }

  return (
    <div className="relative" key={product?.id}>
      <Link
        href={`/product/${product?.slug?.name}`}
        onClick={(e) => {
          setSearchQuery("");
          setIsSearchOpen(false);
          setTimeout(() => {
            setIsLogoVisible(true);
          }, 200);
          // e.preventDefault();
        }}
      >
        <div
          className={`relative flex py-1 border-t ${
            idx !== 0 && "border-gray-300"
          } `}
          onClick={() => {}}
        >
          <div className="w-[20%]">
            <Image
              src={
                product?.coverPic &&
                product?.coverPic?.url &&
                !product?.coverPic?.url?.includes("assets/img")
                  ? product?.coverPic?.url
                  : product.images && product?.images?.length != 0
                  ? product?.images[0]?.url
                  : constant.errImage
              }
              // src={
              //     product.images && product?.images?.length != 0
              //     ? product?.images[0]?.url
              //     : constant.errImage
              // }
              alt={product?.prodName}
              width={1000}
              height={1000}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col px-2 flex-1 w-full overflow-hidden">
            <div className="text-ellipsis overflow-hidden ... truncate  w-full ">
              <h4 className=" text-[#000]  text-ellipsis overflow-hidden text-start truncate text-sm sm:text-base font-medium ...">
                {product?.prodName}
              </h4>
            </div>
            <div>
              <p className="text-[9px] sm:text-[12px] text-gray-500 text-start line-clamp-1">
                {(product?.isPriceList
                  ? product?.priceList[0]?.weight
                  : product?.shippingWeight) ||
                  (product?.prodDesc &&
                    product?.prodDesc
                      ?.replaceAll("\n", " ")
                      .replaceAll("\\n", " "))}
              </p>
            </div>
            <div className="flex justify-between items-center flex-1 w-full ">
              <div className="flex items-center justify-start gap-2   mb-2 flex-1">
                <p className="text-ellipsis overflow-hidden ... truncate text-center   text-sm sm:text-base font-bold ">
                  {isClient && (
                    <>
                      {currency}{" "}
                      {product?.isPriceList
                        ? `${(
                            product?.priceList[0]?.discountedPrice * currRate
                          )?.toFixed(2)}`
                        : (product?.discountedPrice * currRate)?.toFixed(2)}
                    </>
                  )}
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
                    <>
                      {currency}{" "}
                      {product?.isPriceList
                        ? (product?.priceList[0]?.price * currRate).toFixed(2)
                        : (product?.prodPrice * currRate).toFixed(2)}{" "}
                    </>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* <h1>{product?.prodName}</h1> */}
        </div>
      </Link>
      {!checkIfProductQuanityIsAvailable(product, 0) ? (
        <div className="z-50 absolute bottom-0 top-0 my-auto flex justify-center  items-center right-2">
          <p className="text-primary bg-white px-1 py-1"> Out of Stock</p>
        </div>
      ) : checkIfItemExistInCart(cart, product, { variant: 0 }) ? (
        <div
          className="z-50 absolute bottom-0 top-0 my-auto flex justify-center  items-center right-2"
          onClick={(e) => {
            // e.preventDefault();
            console.log("CLICKED");
          }}
        >
          <div className="flex items-center bg-white px-2 py-1 ">
            <div
              className="bg-slate-200 p-1 cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => {
                if (getProductIndexFromCart(cart, product) >= 0) {
                  dispatch(
                    updateCartItemQuantity({
                      type: "dec",
                      addedQty: product?.minQty || 1,
                      index: getProductIndexFromCart(cart, product),
                    })
                  );
                }
              }}
            >
              <FlatIcon className="flaticon-minus" />
            </div>
            <div className="px-3">
              {getProductFromCart(cart, product)?.quantity}
            </div>
            <div
              className="bg-slate-200 p-1 cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => {
                if (getProductIndexFromCart(cart, product) >= 0) {
                  let currQty =
                    cart[getProductIndexFromCart(cart, product)]?.quantity;
                  if (product.isPriceList) {
                    if (
                      currQty + (product?.minQty || 1) >
                      parseFloat(product?.priceList[0]?.totalQuantity)
                    ) {
                      toast.error("Cannot add more of this item");
                    } else {
                      dispatch(
                        updateCartItemQuantity({
                          type: "inc",
                          addedQty: product?.minQty || 1,
                          index: getProductIndexFromCart(cart, product),
                        })
                      );
                    }
                  } else {
                    if (
                      currQty + (product?.minQty || 1) >
                      parseFloat(product?.productQty)
                    ) {
                      toast.error("Cannot add more of this item");
                    } else {
                      dispatch(
                        updateCartItemQuantity({
                          type: "inc",
                          addedQty: product?.minQty || 1,
                          index: getProductIndexFromCart(cart, product),
                        })
                      );
                      // setQuantity((val) => val + (product?.minQty || 1));
                    }
                  }
                }
              }}
            >
              <FlatIcon className="flaticon-plus" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="z-50 absolute bottom-0 top-0 my-auto flex justify-center cursor-pointer items-center right-2"
          onClick={(e) => {
            addItemToCart(product);
          }}
        >
          <div className="bg-white hover:bg-primary hover:text-white shadow-md p-1 rounded-md">
            <FlatIcon className="flaticon-plus hover:text-white"></FlatIcon>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTile;
