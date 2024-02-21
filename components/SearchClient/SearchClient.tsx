"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { handleTypesenseSearch } from "../../config/typesense";
import logo from "../../images/logo.png";
import useDebounce from "../../utils/useDebounce";
import ProductCard from "../categoryProduct/productCard";

const SearchClient = ({ query }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [searchedProducts, setSearchedProducts] = useState([]);

  const {
    data: searchData,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["search", query],
    queryFn: () => handleTypesenseSearch(query),
    keepPreviousData: true,
  });

  return (
    <div className=" px-body  py-10">
      <div className="w-full  flex flex-col  ">
        <div className="flex w-full justify-center md:hidden">
          <input
            type="text"
            placeholder="Search"
            name=""
            id=""
            value={searchQuery}
            className="py-2 px-2 rounded-lg w-full md:w-[40%] outline-none focus:border-none border border-b"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <Link
            href={`/search?q=${searchQuery}`}
            onClick={() => {
              setSearchQuery("");
              setSearchedProducts([]);
            }}
          >
            <button className="bg-black text-white  px-3 py-2 md:px-4 md:py-3 rounded-tr-lg rounded-br-lg">
              Search
            </button>
          </Link>
        </div>

        {query && (
          <div className="flex py-2 border-b-2 border-primary w-fit">
            <h2 className=" text-xl lg:text-2xl font-semibold">
              Search results for '{query}' (
              {(searchData && searchData?.length) || 0} Results)
            </h2>
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            {/* <div className="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div> */}

            <div className=" flex-col gap-2 w-[40%] md:w-[20%] h-auto">
              <Image
                src={logo}
                alt="logo"
                className=" breathing-animation"
                width={200}
                height={200}
                layout="responsive"
              />
              {/* <p className="text-center">Loading...</p> */}
            </div>
          </div>
        ) : searchData && searchData?.length !== 0 ? (
          <div className="mt-4 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-3">
            {searchData &&
              searchData?.map((product, idx) => {
                return <ProductCard product={product} idx={idx} />;
              })}
          </div>
        ) : (
          query && (
            <div className="flex justify-center items-center h-[50vh]">
              <h2 className="text-2xl font-semibold">No results found.</h2>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchClient;
