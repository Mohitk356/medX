"use client";
import { Listbox, Transition } from "@headlessui/react";
import { Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { auth } from "../../config/firebase-config";
import { fetchSimilarProductsForCart } from "../../config/typesense";
import discountBg from "../../images/Vector (2).svg";
import btnBg from "../../images/image (8).png";
import { useAppSelector } from "../../redux/hooks";
import {
  addToCart,
  getCartObj,
  getPriceListCartObj,
  initializeCart,
  updateIntakeModalValues,
} from "../../redux/slices/cartSlice";
import { openLoginModal } from "../../redux/slices/loginModalSlice";
import { updatedCartFromBackend } from "../../utils/cartUtilities/cartUtility";
import { constant } from "../../utils/constants";
import {
  addCartObjToUser,
  addItemtoWishList,
  fetchSpecificCaloriesProduct,
} from "../../utils/databaseService";
import {
  checkIfPriceDiscounted,
  getCartItemsTotalIntakes,
  getDiscountedPercentage,
} from "../../utils/utilities";
import ProductCarousel from "../HomePage/widgets/ProductCarousel";
import Modal from "../Modal/modal";
import CartItemCard from "../cartitemcard/Cartitemcard";
import FlatIcon from "../flatIcon/flatIcon";

function DailyIntakeModal(props) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(props.selected);
  const [selectedTypeValue, setSelectedTypeValue] = useState(
    props.selectedTypeValue
  );

  return (
    <Modal
      isOpen={props.isDailyIntakeOpen}
      setOpen={props.setIsDailyIntakeOpen}
    >
      <div className="bg-white w-[95vw] md:w-[70vw] lg:w-[40vw] p-4 rounded-br-xl relative">
        <div className="w-full flex justify-center items-center">
          <h3 className="font-bold text-lg lg:text-xl">
            Add your Daily Intake
          </h3>
        </div>

        <div
          className="absolute right-4 top-4 cursor-pointer"
          onClick={() => {
            props.setIsDailyIntakeOpen(false);
            document.body.classList.remove("no-scroll");
          }}
        >
          <FlatIcon
            className={
              "flaticon-close text-primary text-base sm:text-lg md:text-xl"
            }
          ></FlatIcon>
        </div>
        <div className="w-full flex mt-7 items-center">
          <h3 className="font-semibold text-base lg:text-lg">
            Enter your Daily Intake
          </h3>
        </div>
        <div className="flex flex-col gap-3 mt-3 md:flex-row">
          <div className="flex-1">
            <Listbox value={selected} onChange={setSelected}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default  bg-white py-1 pl-1 pr-5 md:py-2 md:pl-3 md:pr-10 text-left rounded-[1px] border border-gray-200 focus:outline-none sm:text-sm">
                  <span className="block truncate font-semibold">
                    {selected}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FlatIcon className={`flaticon-arrow-down-2`} />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute px-4 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {constant.intakeList.map((intake, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-2 pr-4 border-b border-gray-300 ${
                            active ? " text-primary" : "text-gray-900"
                          }`
                        }
                        value={intake?.name}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {intake.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 right-0 flex items-center pl-3 text-primary">
                                <FlatIcon className={`flaticon-check`} />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <div className="w-full border border-gray-200 flex-1">
            <input
              type="number"
              name=""
              id=""
              min="0"
              value={selectedTypeValue || "Enter Value"}
              onChange={(e) => {
                const inputValue = parseInt(e.target.value, 10);
                if (inputValue <= 0) {
                  toast.error("Enter a value greater than 0");
                } else {
                  setSelectedTypeValue(inputValue);
                }
              }}
              className="w-full py-1 px-1 md:py-2 md:px-3 outline-none focus:border-none"
              placeholder="Enter Value"
            />
          </div>
        </div>
        {/* <div className="w-full  border border-gray-200 flex-1 mt-2">
          <input
            type="number"
            name=""
            id=""
            value={inputCalories || "Enter Calories"}
            onChange={(e) => {
              setInputCalories(parseFloat(e.target.value));
            }}
            className="w-full py-1 px-1 md:py-2 md:px-3 outline-none focus:border-none"
            placeholder="Enter Calories"
          />
        </div> */}
        <div className="w-full mt-5">
          <button
            className="bg-primary w-full rounded-br-lg py-2 text-white font-semibold"
            onClick={() => {
              if (!selectedTypeValue) {
                toast.error("Enter Value");
                return;
              }
              if (!selected || selected === "Select Type") {
                toast.error("Select Type");
                return;
              }
              props.setIsDailyIntakeOpen(false);
              props.setSelected(selected);
              props.setSelectedTypeValue(selectedTypeValue);
              dispatch(
                updateIntakeModalValues({
                  selected,
                  selectedValue: selectedTypeValue,
                })
              );
              document.body.classList.remove("no-scroll");
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}

const CartComponent = () => {
  const { cart, intakeModal } = useAppSelector(
    (state: any) => state.cartReducer
  );
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  const dispatch = useDispatch();

  const [updatedCart, setUpdatedCart] = useState(cart);
  const [loading, setLoading] = useState(true);
  const [isDailyIntakeOpen, setIsDailyIntakeOpen] = useState(false);
  const [selected, setSelected] = useState(
    intakeModal?.selected || "Select Type"
  );
  const [selectedTypeValue, setSelectedTypeValue] = useState(
    intakeModal?.selectedValue || 0
  );
  const [inputCalories, setInputCalories] = useState(0);
  const [isCartUpdated, setIsCartUpdated] = useState(false);
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);

  const { data: similarProducts } = useQuery({
    queryKey: ["cart", "similar-products"],
    queryFn: () => fetchSimilarProductsForCart({ cart: updatedCart }),
    // enabled: isCartUpdated,
  });

  async function updateCart() {
    if (updatedCart.length !== 0) {
      const newCart = await updatedCartFromBackend(cart);

      setUpdatedCart(newCart);
      setIsCartUpdated(true);
      dispatch(initializeCart(newCart));
    }
    setLoading(false);
  }

  useEffect(() => {
    if (loading) {
      updateCart();
    } else {
      setUpdatedCart(cart);
    }
  }, [cart]);

  function getCartTotal() {
    return cart?.reduce((acc, curr) => {
      return acc + curr?.price * curr?.quantity;
    }, 0);
  }

  if (!updatedCart || updatedCart?.length === 0) {
    return (
      <div className="flex flex-col px-body justify-center items-center gap-6 h-[70vh]">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <Link href={"/"} className="bg-black text-white px-3 py-2">
          Start Shopping
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col  ">
      <div className="flex flex-col">
        <div className="flex justify-end gap-2 px-body  items-center mt-4">
          {selected && selectedTypeValue && selectedTypeValue !== 0 ? (
            <div className="flex">
              <p className="font-semibold text-base sm:text-lg md:text-xl">
                Total {selected}: {getCartItemsTotalIntakes(cart, selected)}/
                {selectedTypeValue} {selected}
              </p>
            </div>
          ) : (
            <></>
          )}
          <button
            className="flex w-60 h-9 md:w-64 md:h-10 lg:w-72 lg:h-14 bg-zinc-950 rounded-br-[10px] gap-1 md:gap-2 justify-center items-center"
            onClick={() => {
              document.body.classList.add("no-scroll");
              setIsDailyIntakeOpen(true);
            }}
          >
            <FlatIcon
              className={"flaticon-plus text-white text-sm md:text-base"}
            />
            <p className="text-center text-white text-sm md:text-base font-medium tracking-tight">
              Add your Daily Intake
            </p>
          </button>
        </div>

        <div className="flex flex-col px-body border-gray-300  gap-16 mt-8">
          {updatedCart?.map((item: any, key: any) => (
            <CartItemCard
              mykey={key}
              item={item}
              selected={selected}
              selectedTypeValue={selectedTypeValue}
              inputCalories={inputCalories}
            />
          ))}
        </div>
        <Link
          href={"/checkout"}
          className="px-body"
          onClick={(e) => {
            if (
              !auth.currentUser?.uid &&
              !sessionStorage.getItem("guestLogin")
            ) {
              e.preventDefault();
              dispatch(openLoginModal());
            } else if (
              getCartTotal() * currRate <
              parseFloat((50 * currRate).toFixed(2))
            ) {
              e.preventDefault();
              toast.error(
                `Cart amount should be greater than ${(50 * currRate).toFixed(
                  2
                )} ${currency}`
              );
            } else {
              if (
                selectedTypeValue > getCartItemsTotalIntakes(cart, selected)
              ) {
                e.preventDefault();

                setSuggestionModalOpen(true);
              }
            }
          }}
        >
          <div className=" mt-16 mb-10  flex  w-full justify-center items-center h-[40px] md:h-[60px] rounded-br-[10px]  bg-primary text-white">
            <p className=" h-[25px] text-center text-white text-lg md:text-xl font-semibold leading-[25px] tracking-tight">
              Proceed to Checkout
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-4 mb-4 ">
          {/* <h2 className="font-semibold text-2xl">Similar Products</h2> */}
          <ProductCarousel
            customProducts={similarProducts}
            isDotsVisible={false}
            customSectionName={"Similar Products"}
          />
        </div>
      </div>

      {suggestionModalOpen ? (
        <ProductSuggestionModal
          cart={cart}
          suggestionModalOpen={suggestionModalOpen}
          setSuggestionModalOpen={setSuggestionModalOpen}
          inputCalories={inputCalories}
          totalCaloriesFromCart={getCartItemsTotalIntakes(cart, selected)}
          selectedTypeValue={selectedTypeValue}
          selected={selected}
        />
      ) : (
        <></>
      )}
      <DailyIntakeModal
        isDailyIntakeOpen={isDailyIntakeOpen}
        setIsDailyIntakeOpen={setIsDailyIntakeOpen}
        selected={selected}
        setSelected={setSelected}
        selectedTypeValue={selectedTypeValue}
        setSelectedTypeValue={setSelectedTypeValue}
        setInputCalories={setInputCalories}
        inputCalories={inputCalories}
      />
    </div>
  );
};

export default CartComponent;

function ProductSuggestionModal({
  suggestionModalOpen,
  setSuggestionModalOpen,
  inputCalories,
  totalCaloriesFromCart,
  selectedTypeValue,
  selected,
  cart,
}: any) {
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  const [hoveredProduct, setHoveredProduct] = useState("");
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(null);
  const slider = useRef<any>(null);
  const dispatch = useDispatch();
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: true,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1242,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1515,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 3.5,
          infinite: false,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 833,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 3.5,
          initialSlide: 1,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2.5,
          initialSlide: 1,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2.5,
          dots: false,
          arrows: false,
        },
      },
    ],
  };

  const getData = async () => {
    setLoading(true);
    try {
      if (!(parseFloat(selectedTypeValue.toString()) - totalCaloriesFromCart)) {
        setSuggestionModalOpen(false);
        return;
      }

      const data = await fetchSpecificCaloriesProduct(
        selectedTypeValue - totalCaloriesFromCart,
        cart,
        selected
      );
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [cart]);

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return <div className={`${className}`} onClick={onClick} />;
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return <div className={`${className}`} onClick={onClick} />;
  }

  async function addItemToCart(product) {
    let data: any = {
      product,
      productID: product?.id,
      quantity: product?.minQty || 1,
      index: 0,
      isPriceList: product?.isPriceList,
    };
    const cartObject = data.isPriceList
      ? getPriceListCartObj({
          product: product,
          quantity: product?.minQty || 1,
          index: data.index,
        })
      : getCartObj({
          product: product,
          productID: product?.id,
          quantity: product?.minQty || 1,
        });
    if (auth.currentUser) {
      const docId = await addCartObjToUser(cartObject);
      cartObject["id"] = docId;
    }
    dispatch(addToCart(cartObject));
  }

  async function handleAddToCartFromModal(product) {
    addItemToCart(product);
  }

  return (
    <Modal isOpen={suggestionModalOpen} setOpen={setSuggestionModalOpen}>
      <div className="bg-white w-[95vw] md:w-[80vw] lg:w-[85vw] p-4 rounded-br-xl relative">
        <div className="w-full flex justify-center items-center">
          <h3 className="font-semibold text-lg lg:text-xl">
            Just{" "}
            {parseFloat(
              (selectedTypeValue - totalCaloriesFromCart).toString()
            ).toFixed(2)}{" "}
            {selected} left, Add more
          </h3>
        </div>
        <div className="">
          {loading ? (
            <div className="flex justify-between gap-2 h-[260]">
              <Skeleton animation="wave" height={250} className=" w-[25%]" />
              <Skeleton animation="wave" height={250} className=" w-[25%]" />
              <Skeleton animation="wave" height={250} className=" w-[25%]" />
              <Skeleton animation="wave" height={250} className=" w-[25%]" />
            </div>
          ) : products && products?.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <h2 className="text-xl font-semibold">
                No Product found with {selected} less than{" "}
                {selectedTypeValue - totalCaloriesFromCart}
              </h2>
            </div>
          ) : (
            <div className="py-6 px-2">
              <Slider
                ref={slider}
                {...settings}
                className=""
                dotsClass={`slick-dots `}
                nextArrow={<SampleNextArrow />}
                prevArrow={<SamplePrevArrow />}
                draggable={true}
              >
                {products &&
                  products?.map((product: any) => {
                    const productData = product?.data || product;
                    return (
                      <div
                        className="flex-1 flex flex-col gap-6 "
                        key={product?.id}
                      >
                        <div className="flex justify-center items-center">
                          <p className="font-semibold text-xs sm:text-sm md:text-base">
                            {
                              productData?.intake[
                                selected === "Calories"
                                  ? "calorie"
                                  : selected.toLowerCase()
                              ]
                            }{" "}
                            {selected} / Serving
                          </p>
                        </div>

                        <div
                          className="flex  mt-6 flex-col border border-[#3b2828] py-2 rounded-br-lg px-2  mx-1.5 relative  h-full  "
                          onMouseEnter={() => {
                            setHoveredProduct(product?.id);
                          }}
                          onMouseLeave={() => {
                            setHoveredProduct("");
                          }}
                        >
                          <div className=" relative rounded-br-3xl mb-2">
                            <div className="h-[120px] lg:h-[160px] p-2 ">
                              <Image
                                src={
                                  product?.coverPic && product?.coverPic?.url
                                    ? product?.coverPic?.url
                                    : product.images &&
                                      product?.images?.length != 0
                                    ? product?.images[0]?.url
                                    : constant.errImage
                                }
                                alt={product?.prodName || ""}
                                width={1000}
                                height={1000}
                                className="w-full h-full object-fit rounded-br-3xl"
                              />
                            </div>
                            <div className="absolute top-0 left-0 w-full px-2 pt-2 flex justify-between  text-white">
                              {checkIfPriceDiscounted({
                                discountedPrice: product?.discountedPrice,
                                price: product?.prodPrice,
                              }) ? (
                                <div className="relative">
                                  <Image src={discountBg} alt="discountBG" className="" />
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit flex gap-1 text-xs">
                                    <p>
                                      {getDiscountedPercentage({
                                        price: product?.prodPrice,
                                        discountedPrice:
                                          product?.discountedPrice,
                                      })}
                                    </p>
                                    <p>OFF</p>
                                  </div>
                                </div>
                              ) : (
                                <div></div>
                              )}

                              <div
                                className="pr-1 pt-1 cursor-pointer"
                                onClick={() => {
                                  addItemtoWishList(product);
                                }}
                              >
                                <FlatIcon className="flaticon-heart text-2xl text-gray-200" />
                              </div>
                            </div>
                            <div
                              onClick={() => {
                                handleAddToCartFromModal(productData);
                              }}
                              className={` cursor-pointer absolute bottom-0 w-full h-[30px] ${
                                hoveredProduct === product?.id
                                  ? "visible"
                                  : "invisible"
                              }`}
                            >
                              <Image
                                src={btnBg}
                                alt="button Bg"
                                width={1000}
                                height={1000}
                                className="w-full h-full object-fit "
                              />
                              <h2 className="absolute top-0 left-0 bottom-0 right-0 mx-auto flex justify-center items-center text-white">
                                Add to Cart
                              </h2>
                            </div>
                          </div>
                          <div className="flex  overflow-hidden truncate w-full text-sm font-medium text-[#ADADAD] mb-1">
                            <h2 className="">{product?.vendorName || ""}</h2>
                          </div>
                          <div className=" line-clamp-2  w-full text-base font-semibold mb-1 ">
                            <h2 className="">{product?.prodName}</h2>
                          </div>
                          {/* <div className="flex gap-2 items-center overflow-hidden  w-full mb-1.5 ">
                            <h2 className="text-primary">
                              {" "}
                              &#10027;&#10027;&#10027;&#10027;&#10027;{" "}
                            </h2>
                            <p className="text-[#ADADAD] text-sm">(10)</p>
                          </div> */}
                          <div className="flex gap-3 items-center">
                            <h3 className=" text-lg font-semibold">
                              {currency}{" "}
                              {(
                                productData?.discountedPrice * currRate
                              ).toFixed(2)}
                            </h3>
                            {checkIfPriceDiscounted({
                              discountedPrice: productData?.discountedPrice,
                              price: productData?.prodPrice,
                            }) && (
                              <h6 className="text-[#ADADAD] line-clamp-1 line-through text-xs font-medium">
                                {currency}{" "}
                                {(productData?.prodPrice * currRate).toFixed(2)}
                              </h6>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Slider>
            </div>
          )}
        </div>
        <div className="flex justify-between gap-6">
          <div className="flex-1">
            <button
              onClick={() => {
                setSuggestionModalOpen(false);
              }}
              className="w-full text-primary py-2 rounded-br-lg border-primary border "
            >
              No, I am Good
            </button>
          </div>
          <div className="flex-1">
            <button
              onClick={() => {
                setSuggestionModalOpen(false);
              }}
              className="w-full text-primary py-2 rounded-br-lg border-primary border "
            >
              Add More Products
            </button>
          </div>
          <div className="flex-1">
            <Link href={"/checkout"}>
              <button className="w-full py-2 rounded-br-lg border-primary border  bg-primary text-white">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
