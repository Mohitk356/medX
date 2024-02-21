"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { constant } from "../../utils/constants";
import {
  addCartObjToUser,
  addItemtoWishList,
  additionalProductData,
  fetchSingleProduct,
  fetchUserWishList,
  getStoreDetails,
  removeItemFromWishList,
} from "../../utils/databaseService";
import useOnScreen from "../../utils/visibleElement";
import IntakeCard from "../intakecard/IntakeCard";

import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsCalendar2Check, BsFillTelephoneFill } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";
import { Ri24HoursLine } from "react-icons/ri";
import ReactPlayer from "react-player";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { auth } from "../../config/firebase-config";
import { fetchSimilarProductsForCart } from "../../config/typesense";
import { useAppSelector } from "../../redux/hooks";
import {
  addToCart,
  getCartObj,
  getPriceListCartObj,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import {
  checkIfItemExistInCart,
  checkIfPriceDiscounted,
  checkIfProductHasSection,
  checkIfProductQuanityIsAvailable,
  getProductFilteredSections,
  getProductPriceDetails,
  getStockInfo,
} from "../../utils/utilities";
import ProductCarousel from "../HomePage/widgets/ProductCarousel";
import FlatIcon from "../flatIcon/flatIcon";
import Loading from "../../app/loading";
import Head from "next/head";
const features = [
  " 10 in stock",
  " Easy Return Policy",
  " Quality Assured Products",
];
const ProductInfo = ({ params }: any) => {
  const slug = params?.slug?.length !== 0 ? params?.slug[0] : "";

  const router = useRouter();
  const { data: storeData } = useQuery({
    queryKey: ["storeDetails"],
    queryFn: () => getStoreDetails(),
    keepPreviousData: true,
  });
  const { data: product, isFetching } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchSingleProduct(slug),
    onSuccess: (data) => {},
    keepPreviousData: false,
  });
  const { data: productAdditionalData } = useQuery({
    queryKey: ["product", params?.slug, "additionalData"],
    queryFn: () => additionalProductData(product),
    keepPreviousData: false,
    enabled: !!product,
  });

  const [currentImage, setCurrentImage] = useState(
    (product && product?.coverPic?.url) || ""
  );
  const [wishlistLoading, setWishListLoading] = useState(false);
  const queryClient = useQueryClient();
  const cart = useAppSelector((state) => state.cartReducer.cart);
  const dispatch: any = useDispatch();
  const [otherProductsSelectedTab, setOtherProductsSelectedTab] =
    useState("similar");

  const { data: userWishList } = useQuery({
    queryKey: ["userWishlist"],
    queryFn: fetchUserWishList,
  });

  const { data: similarProducts } = useQuery({
    queryKey: ["product", params?.slug, "similar-products"],
    queryFn: () =>
      fetchSimilarProductsForCart({ searchKeywords: product?.searchKeywords }),
    enabled: product !== null,
    // enabled: isCartUpdated,
  });

  const ref = useRef<HTMLDivElement>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isVisible = product ? useOnScreen(ref) : false;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [quantity, setQuantity] = useState((product && product?.minQty) || 1);
  const [variant, setVariant] = useState(0);
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");

  function getSelectedVariant() {
    if (!option1 && !option2) {
      setVariant(0);
      setOption1(product.priceList[0]?.weight.split("/")[0]?.trim());
      setOption2(product.priceList[0]?.weight.split("/")[1]?.trim());
      return;
    } else {
      let weight = `${option1} / ${option2}`;
      let index = product?.priceList?.findIndex((x) => x.weight === weight);
      if (index !== -1) {
        setVariant(index);
      }
    }
  }

  useEffect(() => {
    if (product && product.isPriceList) {
      getSelectedVariant();
    }
  }, [option1, option2]);

  useEffect(() => {
    if (similarProducts && similarProducts?.length <= 0) {
      setOtherProductsSelectedTab("brand");
    }
    if (
      productAdditionalData?.brandProducts &&
      productAdditionalData?.brandProducts?.length <= 0 &&
      similarProducts &&
      similarProducts?.length !== 0
    ) {
      setOtherProductsSelectedTab("similar");
    }
  }, [productAdditionalData, similarProducts]);

  async function addItemToCart() {
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    let data: any = {
      product,
      productID: product?.id,
      quantity: quantity,
      index: variant,
      isPriceList: product?.isPriceList,
    };
    try {
      const cartObject = data.isPriceList
        ? getPriceListCartObj({
            product: product,
            quantity: quantity,
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

  function handleRemoveFromCart() {
    let data: any = {
      product,
      productID: product?.id,
      quantity: quantity,
      index: variant,
      isPriceList: product?.isPriceList,
    };
    dispatch(removeFromCart(data));
  }

  const [selectedTab, setSelectedTab] = useState("description");
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  // function getImage({ initial = true }) {
  //   if (product) {
  //     if (initial) {
  //       console.log("INSIDE INITIAL");

  //       if (
  //         product?.isPriceList &&
  //         product?.priceList[0] &&
  //         product?.priceList[0]?.images &&
  //         product?.priceList[0]?.images?.length !== 0
  //       ) {
  //         return product?.priceList[0]?.images[0]?.url || "";
  //       } else {
  //         return product?.coverPic?.url || "";
  //       }
  //     } else {
  //       console.log("OUTSIDE INITIAL");

  // if (
  //   product?.isPriceList &&
  //   product?.priceList[variant] &&
  //   product?.priceList[variant]?.images &&
  //   product?.priceList[variant]?.images?.length !== 0
  // ) {
  //   setCurrentImage(product?.priceList[variant]?.images[0]?.url);
  // } else {
  //   setCurrentImage(product?.coverPic?.url || "");
  // }
  //     }
  //   } else {
  //     return null;
  //   }
  // }

  useEffect(() => {
    if (
      product?.isPriceList &&
      product?.priceList[variant] &&
      product?.priceList[variant]?.images &&
      product?.priceList[variant]?.images?.length !== 0
    ) {
      setCurrentImage(product?.priceList[variant]?.images[0]?.url);
    } else {
      setCurrentImage(product?.coverPic?.url || "");
    }
  }, [variant]);

  useEffect(() => {
    if (product?.isPriceList) {
      for (let index = 0; index < product?.priceList.length; index++) {
        const element = product?.priceList[index];
        if (element?.totalQuantity !== "0") {
          setVariant(index);
          break;
        }
      }
    }
  }, [product]);

  useEffect(() => {
    if (!product && !isFetching) {
      let newSlug = slug?.split("-").join(" ");
      router.replace(`/search?q=${encodeURIComponent(newSlug)}`);
    }
  }, [isFetching]);

  return (
    <>
      {!product && <Loading />}
      {product && (
        <div className="relative">
          {/* <Headersection heading={product?.prodName} /> */}

          <div className="flex flex-col px-[5%] ">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-9 md:gap-12 mt-6 mb-10 ">
              <div className="flex flex-col w-full md:w-[40%]">
                <Image
                  src={currentImage || constant?.errImage}
                  alt={product?.prodName}
                  width={1000}
                  height={1000}
                  className="w-full  object-contain"
                ></Image>

                {product?.isPriceList ? (
                  <>
                    {product?.priceList[variant]?.images &&
                      product?.priceList[variant]?.images?.length !== 0 && (
                        <div className="flex flex-wrap gap-3 mt-1">
                          {product?.priceList[variant]?.images?.map((image) => {
                            return (
                              <div
                                key={image?.url}
                                onClick={() => {
                                  setCurrentImage(image?.url);
                                }}
                                className="hover:scale-105 border border-black rounded-md hover:cursor-pointer ease-in relative w-[70px] md:w-[100px]"
                              >
                                {image?.url === currentImage && (
                                  <div className="absolute w-full h-full bg-black bg-opacity-40  text-white"></div>
                                )}
                                <Image
                                  src={image?.url}
                                  alt={product?.prodName || ""}
                                  width={1000}
                                  height={1000}
                                  className="w-full h-full object-contain rounded-md  ease-in"
                                  // layout="responsive"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </>
                ) : (
                  <>
                    {product?.images && product?.images?.length !== 0 && (
                      <div className="flex flex-wrap gap-3 mt-1">
                        {product?.images?.map((image) => {
                          return (
                            <div
                              key={image?.url}
                              onClick={() => {
                                setCurrentImage(image?.url);
                              }}
                              className="hover:scale-105 border border-black rounded-md hover:cursor-pointer ease-in relative w-[70px] md:w-[100px]"
                            >
                              {image?.url === currentImage && (
                                <div className="absolute w-full h-full bg-black bg-opacity-40  text-white"></div>
                              )}
                              <Image
                                src={image?.url}
                                alt={product?.prodName || ""}
                                width={1000}
                                height={1000}
                                className="w-full h-full object-contain rounded-md  ease-in"
                                // layout="responsive"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="hidden md:block w-[10%]"></div>

              {/* <div className="relative  h-auto  aspect-square  w-full max-h-[300px] mt-6   md:w-[60%]  md:max-h-[500px] rounded-md  shadow-sm flex flex-col gap-2">
                {currentImage === null ? (
                  <Skeleton animation="wave" height={400} />
                ) : (
                  <Image
                    src={currentImage || constant.errImage}
                    alt={product?.prodName || ""}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-contain rounded-md"
                    // layout="responsive"
                  />
                )}
                {product?.images && product?.images?.length !== 0 && (
                  <div className=" flex flex-wrap gap-3 relative ">
                    {product?.images?.map((image) => {
                      return (
                        <div
                          key={image?.url}
                          onClick={() => {
                            setCurrentImage(image?.url);
                          }}
                          className="hover:scale-105 border border-black rounded-md hover:cursor-pointer ease-in relative w-[100px]"
                        >
                          {image?.url === currentImage && (
                            <div className="absolute w-full h-full bg-black bg-opacity-40  text-white"></div>
                          )}
                          <Image
                            src={image?.url}
                            alt={product?.prodName || ""}
                            width={1000}
                            height={1000}
                            className="w-full h-full object-contain rounded-md  ease-in"
                            // layout="responsive"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div> */}

              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4   w-full md:w-[60%] ">
                <div className="flex justify-between ">
                  <h2 className="text-base sm:text-lg  lg:text-xl w-[70%]   font-semibold ">
                    {product?.prodName}
                  </h2>
                  {/* <h2 className="text-primary text-sm sm:text-base md:text-lg lg:text-xl">
                    {" "}
                    &#10027;&#10027;&#10027;&#10027;&#10027;
                    <span className="text-sm font-medium text-zinc-400">
                      (27)
                    </span>{" "}
                  </h2> */}
                </div>

                {product?.isPriceList &&
                  (product?.variants?.option1 ||
                    product?.variants?.option2) && (
                    <div className="flex flex-col gap-2 ">
                      {product?.isPriceList && product?.variants?.option1 && (
                        <>
                          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl  font-medium  mb-1">
                            Size:
                          </h2>
                          <div className="flex gap-3">
                            {product?.variants?.option1?.map((option, idx) => {
                              return (
                                <div
                                  className={`px-5 py-1 md:px-8 md:py-3 border ${
                                    option1 === option
                                      ? "bg-primary border-white"
                                      : "bg-[#F7F7F7]"
                                  } w-fit shadow-md cursor-pointer`}
                                  key={idx}
                                  onClick={() => {
                                    setOption1(option);
                                  }}
                                >
                                  <h2
                                    className={`${
                                      option1 === option
                                        ? "text-white "
                                        : "text-black"
                                    } text-sm  font-semibold`}
                                  >
                                    {option}
                                  </h2>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                      {product?.isPriceList && product?.variants?.option2 && (
                        <>
                          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl  font-medium  mb-1">
                            Flavour:
                          </h2>
                          <div className="flex gap-3">
                            {product?.variants?.option2?.map((option, idx) => {
                              return (
                                <div
                                  className={`px-5 py-1 md:px-8 md:py-3 border ${
                                    option2 === option
                                      ? "bg-primary border-white"
                                      : "bg-[#F7F7F7]"
                                  } w-fit shadow-md cursor-pointer`}
                                  key={idx}
                                  onClick={() => {
                                    setOption2(option);
                                  }}
                                >
                                  <h2
                                    className={`${
                                      option2 === option
                                        ? "text-white "
                                        : "text-black"
                                    } md:text-sm text-xs font-semibold`}
                                  >
                                    {option}
                                  </h2>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                {product?.isPriceList &&
                  !product?.variants?.option1 &&
                  !product?.variants?.option2 && (
                    <div>
                      <div className="flex gap-3 flex-wrap">
                        {product?.priceList?.map((variantData, idx) => {
                          return (
                            <button
                              className={`px-5 py-1 md:px-8 md:py-3 border  flex justify-center items-center ${
                                product?.priceList[idx]?.totalQuantity !== "0"
                                  ? variant === idx
                                    ? "bg-primary border-white"
                                    : "bg-[#F7F7F7]"
                                  : "bg-[#ccc] cursor-not-allowed shadow-[#ccc]"
                              } w-fit shadow-md rounded-md cursor-pointer`}
                              key={idx}
                              onClick={() => {
                                if (
                                  product?.priceList[idx]?.totalQuantity !== "0"
                                )
                                  setVariant(idx);
                              }}
                            >
                              <h2
                                className={`${
                                  product?.priceList[idx]?.totalQuantity !== "0"
                                    ? variant === idx
                                      ? "text-white "
                                      : "text-black"
                                    : "text-[#666] cursor-not-allowed"
                                } text-sm  font-semibold`}
                              >
                                {variantData?.weight}
                              </h2>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                <div className="flex flex-col gap-2">
                  <div className="flex-1 lg:flex-none  flex border border-black p-px w-fit">
                    <div
                      className="bg-gray-100 px-2 flex-[0.4] flex justify-center items-center text-xs sm:text-sm md:text-base lg:text-lg font-bold cursor-pointer select-none"
                      onClick={() => {
                        if (quantity - (product?.minQty || 1)) {
                          setQuantity((val) => val - (product?.minQty || 1));
                        }
                      }}
                    >
                      -
                    </div>

                    <div className="flex-1 px-2 sm:px-3 md:px-4 lg:px-5 flex justify-center items-center text-xs sm:text-sm md:text-base ">
                      <p className="">{quantity}</p>
                    </div>
                    <div
                      className="bg-gray-100 px-2 flex-[0.4]  flex justify-center items-center text-xs sm:text-sm md:text-base lg:text-lg font-bold cursor-pointer select-none"
                      onClick={() => {
                        if (product.isPriceList) {
                          if (
                            quantity + (product?.minQty || 1) >
                            parseFloat(
                              product?.priceList[variant]?.totalQuantity
                            )
                          ) {
                            toast.error("Cannot add more of this item");
                          } else {
                            setQuantity((val) => val + (product?.minQty || 1));
                          }
                        } else {
                          if (
                            quantity + (product?.minQty || 1) >
                            parseFloat(product?.productQty)
                          ) {
                            toast.error("Cannot add more of this item");
                          } else {
                            setQuantity((val) => val + (product?.minQty || 1));
                          }
                        }
                      }}
                    >
                      +
                    </div>
                  </div>

                  <div className="flex gap-3 items-center">
                    <h2 className=" text-base sm:text-lg md:text-xl lg:text-2xl  text-center text-red-600 text-[22px] font-medium ">
                      {isClient && currency}{" "}
                      {isClient &&
                        getProductPriceDetails({
                          isDiscounted: true,
                          product: product,
                          currRate,
                          index: variant,
                        })}
                    </h2>
                    {checkIfPriceDiscounted({
                      discountedPrice: product?.isPriceList
                        ? product?.priceList[variant]?.discountedPrice
                        : product?.discountedPrice,
                      price: product?.isPriceList
                        ? product?.priceList[variant]?.price
                        : product?.prodPrice,
                    }) && (
                      <div className="text-ellipsis overflow-hidden ... truncate  ">
                        <p className="text-ellipsis overflow-hidden ... truncate   line-through text-xs md:text-sm text-[#ADADAD]">
                          {isClient && currency}{" "}
                          {isClient &&
                            getProductPriceDetails({
                              isDiscounted: false,
                              product: product,
                              currRate,
                              index: variant,
                            })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* <h2 className="lg:hidden text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                  {isClient && currency}{" "}
                  {isClient &&
                    getProductPriceDetails({
                      isDiscounted: true,
                      product: product,
                      currRate,
                      index: variant,
                    })}
                </h2> */}

                <div
                  className="flex justify-between gap-2 w-full flex-col md:flex-row "
                  ref={ref}
                >
                  <div className="flex-1 lg:flex-none md:w-[48%] w-full h-10 md:h-14 bg-black rounded-br-[10px] flex justify-center items-center py-2 border  cursor-pointer">
                    <button
                      className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-normal "
                      onClick={async () => {
                        try {
                          if (!auth.currentUser?.uid)
                            return toast.error("Please Login.");

                          if (wishlistLoading) return;
                          if (
                            userWishList &&
                            userWishList?.filter(
                              (val) => val?.id === product?.id
                            ).length > 0
                          ) {
                            setWishListLoading(true);
                            let res = await removeItemFromWishList(
                              userWishList?.filter(
                                (val) => val?.id === product?.id
                              )[0]?.id
                            );

                            if (res) {
                              await queryClient.invalidateQueries({
                                queryKey: ["userWishlist"],
                              });
                              await queryClient.refetchQueries({
                                queryKey: ["userWishlist"],
                              });
                              setWishListLoading(false);

                              toast.success("Product removed from wishlist");
                            } else {
                              setWishListLoading(false);
                              toast.error(
                                "Cannot add to wishlist. Try again later"
                              );
                            }
                          } else {
                            setWishListLoading(true);
                            let res = await addItemtoWishList(product);

                            if (res) {
                              await queryClient.invalidateQueries({
                                queryKey: ["userWishlist"],
                              });
                              await queryClient.refetchQueries({
                                queryKey: ["userWishlist"],
                              });
                              setWishListLoading(false);
                              toast.success("Product added to wishlist");
                            } else {
                              setWishListLoading(false);

                              toast.error(
                                "Cannot add to wishlist. Try again later"
                              );
                            }
                          }
                        } catch (error) {}
                      }}
                    >
                      {wishlistLoading ? (
                        <>
                          <CircularProgress className="!text-white" size={25} />
                        </>
                      ) : userWishList &&
                        userWishList?.filter((val) => val?.id === product?.id)
                          .length > 0 ? (
                        "Remove from Wishlist"
                      ) : (
                        "Add to Wishlist"
                      )}
                    </button>
                  </div>

                  {isClient &&
                  !checkIfProductQuanityIsAvailable(product, variant) ? (
                    <div
                      className="flex-1 lg:flex-none  md:w-[48%] w-full h-10 md:h-14 bg-gray-400 rounded-br-[10px] flex justify-center items-center py-2 border  cursor-pointer"
                      onClick={
                        !checkIfProductQuanityIsAvailable(product, variant)
                          ? () => {}
                          : addItemToCart
                      }
                    >
                      <button className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-normal">
                        Out of Stock
                      </button>
                    </div>
                  ) : (
                    !checkIfItemExistInCart(cart, product, { variant }) && (
                      <div
                        className="flex-1 lg:flex-none  md:w-[48%] w-full h-10 md:h-14 bg-red-600 rounded-br-[10px] flex justify-center items-center py-2 border border-[#a9e1fc] cursor-pointer"
                        onClick={addItemToCart}
                      >
                        <button className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-normal">
                          Add To Cart
                        </button>
                      </div>
                    )
                  )}

                  {/* {isClient && (
                    <div
                      className="flex-1 lg:flex-none w-[48%] h-14 bg-red-600 rounded-br-[10px] flex justify-center items-center py-2 border border-[#a9e1fc] cursor-pointer"
                      onClick={
                        checkIfItemExistInCart(cart, product)
                          ? () => {}
                          : addItemToCart
                      }
                    >
                      <button className="text-white text-lg font-normal">
                        {checkIfItemExistInCart(cart, product)
                          ? "Go To Cart"
                          : "Add To Cart"}
                      </button>
                    </div>
                  )} */}

                  {isClient &&
                    checkIfItemExistInCart(cart, product, { variant }) && (
                      <Link
                        href={`/cart`}
                        className="flex-1 lg:flex-none  md:w-[48%] w-full h-10 md:h-14 bg-primary rounded-br-[10px] flex justify-center items-center py-2 border  cursor-pointer"
                      >
                        <div>
                          <button className="text-white font-bold">
                            Proceed to Cart
                          </button>
                        </div>
                      </Link>
                    )}
                </div>
                <div className="flex gap-2 flex-col">
                  {features.map((feature, index) =>
                    index === 0 ? (
                      getStockInfo(product, variant) ? (
                        <div
                          key={feature}
                          className="text-black  items-center text-sm font-semibold  tracking-tight flex gap-2"
                        >
                          <div className="bg-primary rounded-full h-[14px] w-[14px] md:h-[20px] md:w-[20px] flex items-center justify-center  p-[3px]">
                            <FlatIcon className="flaticon-check text-white text-xs"></FlatIcon>
                          </div>{" "}
                          {getStockInfo(product, variant)} units in Stock
                        </div>
                      ) : (
                        <></>
                      )
                    ) : (
                      <div
                        className="text-black  items-center text-sm font-semibold  tracking-tight flex gap-2"
                        key={index}
                      >
                        {" "}
                        <div className="bg-primary rounded-full h-[14px] w-[14px] md:h-[20px] md:w-[20px] flex items-center justify-center  p-[3px]">
                          <FlatIcon className="flaticon-check text-white text-xs"></FlatIcon>
                        </div>{" "}
                        {feature}
                      </div>
                    )
                  )}
                  <div className="  items-center text-sm font-semibold  tracking-tight flex gap-2">
                    {" "}
                    <div className="bg-primary rounded-full h-[14px] w-[14px] md:h-[20px] md:w-[20px] flex items-center justify-center  p-[3px]">
                      <FlatIcon className="flaticon-check text-white text-xs"></FlatIcon>
                    </div>{" "}
                    SKU :{" "}
                    {product?.isPriceList
                      ? product?.priceList[variant]?.sku
                      : product?.productCode}
                  </div>
                </div>

                <div className=" h-2 relative w-full ">
                  <div className="absolute top-0 left-0 w-1/3 h-full border-t-[4px] border-[#EA1F27]"></div>
                  <div className="absolute top-0 right-0 w-2/3 h-full border-t-[4px] border-[#ebebeb]"></div>
                </div>

                <div className="">
                  <div className="  w-full md:h-[260px]">
                    <Image
                      src={require("../../images/freeShipping.jpg")}
                      alt="banner"
                      width={1000}
                      height={1000}
                      // layout="responsive"
                      className=" w-full h-full object-fill "
                    />
                  </div>
                  {/* {getProductFreeShippingImage("image-banner", product) &&
                    getProductFreeShippingImage("image-banner", product)
                      ?.length !== 0 &&
                    getProductFreeShippingImage("image-banner", product).map(
                      (slide: any) => {
                        return slide?.arr?.map((image) => {
                          return (
                            <div className="">
                              <Image
                                src={
                                  image.image.org ||
                                  image.image.url ||
                                  image?.image.mob
                                }
                                alt="banner"
                                width={1000}
                                height={1000}
                                layout="responsive"
                                className="flex-1 w-full h-full object-fit "
                              />
                            </div>
                          );
                        });
                      }
                    )} */}
                </div>

                <div className="mt-3 relative border border-primary rounded-lg flex flex-col pt-4 pb-4 justify-center items-center">
                  <div className="font-semibold bg-white absolute -top-3  w-fit px-2  left-0 right-0 mx-auto">
                    Have Questions?
                  </div>
                  <div className="flex flex-row items-start justify-between px-5 w-full mt-2 gap-1">
                    <div className="flex flex-col gap-2 items-start">
                      <div className="flex gap-2 items-center">
                        <BsFillTelephoneFill className="!text-primary" />
                        <p className="font-medium">
                          Toll Free No:{" "}
                          <span className="font-normal">
                            <Link
                              href={`tel:${
                                isClient && storeData && storeData?.storePhone
                              }`}
                              className=""
                            >
                              {(isClient &&
                                storeData &&
                                storeData?.storePhone) ||
                                ""}
                            </Link>
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-2 items-center">
                        <IoLogoWhatsapp className="!text-primary" />
                        <p className="font-medium">
                          Whatsapp{" "}
                          <span className="font-normal">
                            <Link
                              href={`https://wa.me/${
                                isClient &&
                                storeData &&
                                storeData?.whatsappNumber
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {(isClient &&
                                storeData &&
                                storeData?.whatsappNumber) ||
                                ""}
                            </Link>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                      <div className="flex gap-2 items-center ">
                        <Ri24HoursLine className="!text-primary" />
                        <p className="font-medium">24 Hours</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <BsCalendar2Check className="!text-primary" />
                        {/* <FlatIcon className={"flaticon-whatsapp-1"} /> */}
                        <p className="font-medium">7 Days a week</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex md:flex-row flex-col gap-2 md:gap-4 ">
              <div className="flex flex-col gap-[2rem]  w-full md:w-[50%] mb-4 sm:mb-6 md:mb-8">
                <div className="flex gap-6">
                  {product?.prodDesc && (
                    <div
                      className={`font-medium text-xl md:text-2xl  cursor-pointer  ${
                        selectedTab === "description"
                          ? "text-red-600 underline underline-offset-4"
                          : "text-[#555555]"
                      }`}
                      onClick={() => setSelectedTab("description")}
                    >
                      Description
                    </div>
                  )}
                  {product.additonalInfo && (
                    <div
                      className={`font-medium text-xl md:text-2xl  cursor-pointer  ${
                        selectedTab === "additionalInfo"
                          ? "text-red-600 underline underline-offset-4"
                          : "text-[#555555]"
                      }`}
                      onClick={() => setSelectedTab("additionalInfo")}
                    >
                      Additional Information
                    </div>
                  )}
                </div>

                <div className="text-xs md:text-sm font-normal ">
                  {selectedTab === "description" && (
                    <div className="flex flex-col">
                      <div
                        dangerouslySetInnerHTML={{
                          // __html: editHtml(product?.prodDesc),
                          __html: product?.prodDesc
                            .replaceAll("\n", "<br/>")
                            .replaceAll("\\n", "<br/>"),
                        }}
                      />
                      {product?.intake && (
                        <div className="flex gap-4 my-2">
                          {product?.intake?.protein && (
                            <IntakeCard
                              label="Protein"
                              value={product?.intake?.protein}
                              unit="g"
                              calories={product?.intake?.calorie}
                              color="bg-[#603A8C]"
                            />
                          )}
                          {product?.intake?.carbs && (
                            <IntakeCard
                              label="Carbs"
                              value={product?.intake?.carbs}
                              unit="g"
                              calories={product?.intake?.calorie}
                              color="bg-[#F2C200]"
                            />
                          )}
                          {product?.intake?.fat && (
                            <IntakeCard
                              label="Fat"
                              value={product?.intake?.fat}
                              unit="g"
                              calories={product?.intake?.calorie}
                              color="bg-[#61D8C2]"
                            />
                          )}

                          {product?.intake?.calorie && (
                            <IntakeCard
                              label="Calories"
                              value={product?.intake?.calorie}
                              unit="Kcal"
                              calories={product?.intake?.calorie}
                              color="bg-[#ED5C41]"
                            />
                          )}
                        </div>
                      )}
                      {checkIfProductHasSection(productAdditionalData) && (
                        <div className=" pb-6">
                          {getProductFilteredSections(
                            "image-banner",
                            productAdditionalData
                          ).map((slide: any) => {
                            return slide?.arr?.map((image) => {
                              return (
                                <div className="max-w-[450px] ">
                                  <Image
                                    src={
                                      image.image.org ||
                                      image.image.url ||
                                      image?.image.mob
                                    }
                                    alt="banner"
                                    width={1000}
                                    height={1000}
                                    layout="responsive"
                                    className="flex-1 w-full h-full object-fit "
                                  />
                                </div>
                              );
                            });
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  {selectedTab === "additionalInfo" && (
                    <div
                      dangerouslySetInnerHTML={{ __html: product?.prodaddinfo }}
                    />
                  )}
                  {selectedTab === "review" && (
                    <div>
                      {product?.review ? (
                        <></>
                      ) : (
                        <div className="flex  justify-center items-center my-10 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                          No Reviews Yet
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full md:w-[50%]  flex flex-col gap-4 ">
                {checkIfProductHasSection(productAdditionalData) && (
                  <div className="">
                    {checkIfProductHasSection(productAdditionalData) && (
                      <div className=" ">
                        {getProductFilteredSections(
                          "video-block",
                          productAdditionalData
                        ).map((video: any) => {
                          return (
                            <div className=" h-[200px] md:h-[300px] rounded-[50px]">
                              {isClient && (
                                <ReactPlayer
                                  style={{
                                    borderRadius: "50px",
                                  }}
                                  controls={true}
                                  width={`100%`}
                                  height={`100%`}
                                  url={`https://www.youtube.com/watch?v=${video?.docSnap?.videoID}`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {checkIfProductHasSection(productAdditionalData) && (
            <div className=" ">
              {getProductFilteredSections(
                "product-carousel",
                productAdditionalData
              ).map((productSection: any) => {
                return (
                  <div className="mt-10 mb-10">
                    <ProductCarousel
                      customProducts={productSection?.arr}
                      customSectionName={
                        product?.sections?.sections?.filter(
                          (section) => section?.widgetID === productSection?.id
                        ).length !== 0
                          ? product?.sections?.sections?.filter(
                              (section) =>
                                section?.widgetID === productSection?.id
                            )[0]?.sectionName
                          : ""
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex  px-body w-full md:w-[50%]  flex-row  gap-2 md:gap-4 ">
            {similarProducts && similarProducts?.length > 0 && (
              <button
                className={` flex items-center w-[50%] justify-center gap-1 sm:gap-2.5 md:gap-4 px-1 md:px-2 py-1 sm:py-2 md:py-3 rounded-br-lg font-medium border-[2px] ${
                  otherProductsSelectedTab === "similar"
                    ? "border-primary text-primary"
                    : "text-black border-black"
                }`}
                onClick={() => {
                  setOtherProductsSelectedTab("similar");
                }}
              >
                <p className="text-sm md:text-base">More like this</p>
                <span>
                  <FlatIcon className="flaticon-arrow-down-2 -rotate-90 !font-semibold text-sm md:text-base" />
                </span>
              </button>
            )}
            {productAdditionalData?.brandProducts?.length > 0 && (
              <button
                onClick={() => {
                  setOtherProductsSelectedTab("brand");
                }}
                className={` flex items-center w-[50%] justify-center py-1 sm:py-2 md:py-3 px-1  rounded-br-lg gap-1 sm:gap-2.5 md:gap-4 font-medium border-[2px] ${
                  otherProductsSelectedTab === "brand"
                    ? "border-primary text-primary"
                    : "text-black border-black"
                }`}
              >
                <p className="text-sm md:text-base">More from this brand</p>

                <span>
                  <FlatIcon className="flaticon-arrow-down-2 -rotate-90 !font-semibold text-sm md:text-base" />
                </span>
              </button>
            )}
          </div>

          {similarProducts &&
            similarProducts?.length > 0 &&
            otherProductsSelectedTab === "similar" && (
              <div className="mt-10 mb-10">
                <ProductCarousel
                  customProducts={similarProducts}
                  customSectionName={""}
                  isDotsVisible={false}
                  slug={params?.slug}
                />
              </div>
            )}
          {otherProductsSelectedTab === "brand" &&
            productAdditionalData &&
            productAdditionalData?.brandProducts &&
            productAdditionalData?.brandProducts?.length !== 0 && (
              <div className="mt-10 mb-10">
                <ProductCarousel
                  customProducts={productAdditionalData?.brandProducts}
                  customSectionName={""}
                  isDotsVisible={false}
                  slug={params?.slug}
                />
              </div>
            )}

          {/* <Transition
            show={!isVisible}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="lg:hidden"
          >
            <div className="fixed bottom-0 w-full bg-white py-2 px-body">
              <div className="flex gap-2">
                <div className="flex-1 flex border border-black p-px">
                  <div className="bg-gray-100 flex-[0.4] flex justify-center items-center text-lg font-bold">
                    -
                  </div>
                  <div className="flex-1 flex justify-center items-center">
                    <p className="">{quantity}</p>
                  </div>
                  <div className="bg-gray-100 flex-[0.4] flex justify-center items-center text-lg font-bold">
                    +
                  </div>
                </div>
                <div
                  className="flex-1 bg-highlight flex justify-center items-center py-2 border border-[#a9e1fc]"
                  onClick={addItemToCart}
                >
                  <button className="text-white font-bold">Add To Cart</button>
                </div>
              </div>
            </div>
          </Transition> */}
        </div>
      )}
    </>
  );
};
export default ProductInfo;
