// "use client";
// import React, { useState } from "react";
// import { constant } from "../../../utils/constants";
import { useMediaQuery } from "@mui/material";
// import Link from "next/link";
// import Image from "next/image";
// import { checkIfPriceDiscounted } from "../../../utils/utilities";

// const ProductCarouselCard = ({ product }) => {
//   const [image, setImage] = useState(
//     product.images && product?.images?.length != 0
//       ? product?.images[0]?.url
//       : constant.errImage
//   );
//   const matchesSm = useMediaQuery("(min-width:640px)");

//   const [hoveredProduct, setHoveredProduct] = useState("");

//   return (
//     <Link href={`/product/${product?.slug?.name}`} className="flex-1">
//       <div
//         className="h-full mx-3 min-h-[250px] flex flex-col  lg:min-h-[360px]   gap-2 hover:shadow-productCarouselShadow hover:rounded-lg p-6 "
//         key={product?.id}
//         onMouseEnter={() => {
//           setHoveredProduct(product?.id);
//         }}
//         onMouseLeave={() => {
//           setHoveredProduct("");
//         }}
//       >
//         <div className="h-[120px] sm:h-[150px] md:h-[150px] xl:h-[200px]  ">
//           <Image
//             src={image}
//             alt={product?.prodName}
//             width={1000}
//             height={1000}
//             className="w-full h-full object-fit"
//           />
//         </div>
//         <div className="text-ellipsis  overflow-hidden ... truncate     px-2">
//           <h4 className="text-base  text-[#4d4d4d]  text-ellipsis overflow-hidden ... truncate text-center ">
//             {product?.prodName}
//           </h4>
//         </div>
//         {product?.rating && <div>Rating</div>}
//         <div className="flex flex-col   flex-1 justify-end">
//           {checkIfPriceDiscounted({
//             discountedPrice: product?.discountedPrice,
//             price: product?.prodPrice,
//           }) && (
//             <div className="text-ellipsis overflow-hidden ... truncate  px-2">
//               <p className="text-ellipsis overflow-hidden ... truncate  px-2 line-through text-xs text-center text-gray-500 font-medium">
//               AED {product?.prodPrice}
//               </p>
//             </div>
//           )}
//           <div className="text-ellipsis overflow-hidden ... truncate  px-2">
//             <p className="text-ellipsis overflow-hidden ... truncate text-center  px-2 text-highlight font-bold text-xl">
//               AED {product?.discountedPrice.toFixed(2)}
//             </p>
//           </div>
//         </div>
//         {matchesSm && (
//           <div
//             className={`flex justify-center items-center  ${
//               hoveredProduct === product?.id ? "visible" : "invisible"
//             }`}
//           >
//             <button className="w-full bg-highlight py-2 text-white font-medium">
//               Shop now
//             </button>
//           </div>
//         )}
//       </div>
//       {/* <div
//         className={`h-full flex flex-col gap-2 py-2 cursor-pointer hover:shadow-productShadow hover:rounded-lg`}
//         key={product?.id}
//         onMouseEnter={() => {
//           setHoveredProduct(product?.id);
//         }}
//         onMouseLeave={() => {
//           setHoveredProduct("");
//         }}
//       >
//         <div className="h-[120px] sm:h-[150px] md:h-[150px] xl:h-[200px]">
//           <Image
//             src={image}
//             alt={product?.prodName}
//             width={1000}
//             height={1000}
//             className="w-full h-full object-contain"
//           />
//         </div>
//         <div className="text-ellipsis overflow-hidden ... truncate text-center px-2">
//           <h4 className="text-sm text-gray-800 font-medium text-ellipsis overflow-hidden ...">
//             {product?.prodName}
//           </h4>
//         </div>
//         {product?.rating && <div>Rating</div>}
//         <div className="flex flex-col">
//           {checkIfPriceDiscounted({
//             discountedPrice: product?.discountedPrice,
//             price: product?.prodPrice,
//           }) && (
//             <div className="text-ellipsis overflow-hidden ... truncate text-center px-2">
//               <p className="text-ellipsis overflow-hidden ... truncate text-center px-2 line-through text-xs text-gray-500">
//                 {constant.currency} {product?.prodPrice}
//               </p>
//             </div>
//           )}
//           <div className="text-ellipsis overflow-hidden ... truncate text-center px-2">
//             <p className="text-ellipsis overflow-hidden ... truncate text-center px-2 text-highlight font-bold">
//               {constant.currency} {product?.discountedPrice.toFixed(2)}
//             </p>
//           </div>
//         </div>
//         {matchesSm && (
//           <div
//             className={`flex justify-center items-center ${
//               hoveredProduct === product?.id ? "visible" : "invisible"
//             }`}
//           >
//             <button className="w-[80%] bg-highlight py-2 text-white font-medium">
//               Shop now
//             </button>
//           </div>
//         )}
//       </div> */}
//     </Link>
//   );
// };

// export default ProductCarouselCard;

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { constant } from "../../utils/constants";
import { constant } from "../../../utils/constants";
// import btnBg from "../../images/Rectangle 24048.svg"
import discountBg from "../../../images/Vector (2).svg";
import btnBg from "../../../images/image (8).png";
import FlatIcon from "../../flatIcon/flatIcon";
import {
  addItemtoWishList,
  fetchUserWishList,
  removeItemFromWishList,
} from "../../../utils/databaseService";
import { useAppSelector } from "../../../redux/hooks";
import {
  checkIfItemExistsInWishlist,
  checkIfPriceDiscounted,
  getDiscountedPercentage,
} from "../../../utils/utilities";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AiFillHeart } from "react-icons/ai";
import { auth } from "../../../config/firebase-config";
import { usePathname, useRouter } from "next/navigation";

const ProductCarouselCard = ({
  product,
  prodId,
  setIsRemoving = null,
  setIsAdding = null,
  slug = null,
}) => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const queryClient = useQueryClient();
  const { data: userWishList } = useQuery({
    queryKey: ["userWishlist"],
    queryFn: fetchUserWishList,
  });
  const [hoveredProduct, setHoveredProduct] = useState("");
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [image, setImage] = useState(
    product?.coverPic && product?.coverPic?.url?.includes("assets/img")
      ? constant.errImage
      : product?.coverPic?.url || constant.errImage
  );
  const matchesSm = useMediaQuery("(min-width:640px)");

  // console.log(product?.slug?.name,"slug name");

  return (
    <div
      className="flex flex-col relative  mx-1.5  "
      onMouseEnter={() => {
        setHoveredProduct(product?.id);
      }}
      onMouseLeave={() => {
        setHoveredProduct("");
      }}
    >
      <div className="absolute z-10 top-[0px] w-full px-2 pt-2 hidden md:flex justify-between  text-white">
        {checkIfPriceDiscounted({
          discountedPrice: product?.discountedPrice,
          price: product?.prodPrice,
        }) ? (
          <div className="relative">
            <Image src={discountBg} alt="" className="" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit flex gap-1 text-xs">
              <p>
                {getDiscountedPercentage({
                  price: product?.prodPrice,
                  discountedPrice: product?.discountedPrice,
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
              className={`flaticon-heart text-base sm:text-xl md:text-2xl text-primary`}
            />
          )}
        </div>
      </div>

      <Link href={`/product/${product?.slug?.name}`}>
        <div
          className={`border ${
            hoveredProduct === product?.id
              ? "border-primary"
              : "border-[#E3E3E3]"
          } relative rounded-br-3xl mb-2`}
        >
          <div className="h-[160px] lg:h-[250px] p-2 ">
            <Image
              id={product?.id}
              src={image}
              onError={() => {
                setImage(constant.errImage);
              }}
              alt={product?.prodName || ""}
              width={1000}
              height={1000}
              className="w-full h-full object-fit rounded-br-3xl"
            />
          </div>

          <div
            className={`absolute bottom-0 w-full h-[45px] ${
              hoveredProduct === product?.id ? "visible" : "invisible"
            }`}
          >
            <Image
              src={btnBg}
              alt="bg-discount"
              width={1000}
              height={1000}
              className="w-full h-full object-fit "
            />
            <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
              Add to Cart
            </h2>
          </div>
        </div>
        <div className="flex  overflow-hidden truncate w-full text-sm font-medium text-[#ADADAD] mb-1">
          <h2 className="">{product?.vendorName || ""}</h2>
        </div>
        <div className="line-clamp-2  w-full text-base font-semibold mb-1 ">
          <h2 className="">{product?.prodName}</h2>
        </div>
        <div className="flex gap-3 items-center">
          <h3 className=" text-lg font-bold">
            {isClient && currency}{" "}
            {isClient && (product?.discountedPrice * currRate)?.toFixed(2)}
          </h3>
          {checkIfPriceDiscounted({
            discountedPrice: product?.discountedPrice,
            price: product?.prodPrice,
          }) && (
            <h6 className="text-[#ADADAD] line-through text-xs font-semibold">
              {isClient && currency}{" "}
              {isClient && (product?.prodPrice * currRate)?.toFixed(2)}
            </h6>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCarouselCard;
