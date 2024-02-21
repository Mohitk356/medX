"use client";
import React, { useEffect } from "react";
import Slider from "rc-slider";
import { useState } from "react";
import "rc-slider/assets/index.css";
import { useAppSelector } from "../../redux/hooks";
import Modal from "../Modal/modal";

const FilterSection = ({ filters, setFiters, minMax, setMinMax }) => {
  const [sliderValue, setSliderValue] = useState(filters?.price);
  const [isChecked, setIsChecked] = useState(false);
  const [modalPriceState, setModalPriceState] = useState(filters?.price);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  const handleSliderChange = (value: any) => {
    setFiters({ ...filters, price: value });
    // setSliderValue(value);
  };
  const handleModalSliderChange = (value: any) => {
    setModalPriceState(value);
    // setSliderValue(value);
  };
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    setFiters({ ...filters, price: sliderValue });
  }, [sliderValue]);

  return (
    <>
      <div className="w-full flex-[0.2] flex md:hidden gap-4 ">
        <h1>
          Filters:{" "}
          <span>
            <button
              onClick={() => setIsMobileModalOpen(true)}
              className="underline font-medium"
            >
              Apply Filters
            </button>
          </span>
        </h1>

        <div className="flex-1 flex justify-end">
          <h1>Sort By:</h1>
          <select name="" id="">
            <option value="">Best Selling</option>
          </select>
        </div>

        <Modal isOpen={isMobileModalOpen} setOpen={setIsMobileModalOpen}>
          <div className="bg-white w-[70vw] p-body h-auto">
            <h4 className="font-semibold text-lg text-[#232738]">
              Filter by Price
            </h4>
            <div className=" my-3 ">
              <Slider
                range
                min={minMax[0]}
                max={minMax[1]}
                className="text-red"
                defaultValue={filters?.price}
                allowCross={false}
                onChange={(e) => handleModalSliderChange(e)}
              />
            </div>
            <div className="flex justify-between">
              <h2 className="text-xs font-bold">
                {currency}{" "}
                {Math.floor(
                  parseFloat(modalPriceState[0].toString()) * currRate
                )}
              </h2>
              <h2 className="text-xs font-bold">
                {currency}{" "}
                {Math.ceil(
                  parseFloat(modalPriceState[1].toString()) * currRate
                )}
              </h2>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsMobileModalOpen(false)}
                className="bg-gray-300  rounded-md px-3 py-1"
              >
                Cancel
              </button>
              <button
                className="bg-primary text-white rounded-md px-3 py-1"
                onClick={() => {
                  setFiters({ ...filters, price: modalPriceState });
                  setIsMobileModalOpen(false);
                }}
              >
                {" "}
                Apply
              </button>
            </div>
          </div>
        </Modal>
      </div>

      <div className="hidden lg:flex flex-col flex-[0.25]  py-0 mb-10 filter-border ">
        {/* <h4 className="font-semibold text-lg px-5 text-[#232738]">
          Categories
        </h4>
        <p className=" px-5 py-3 mb-1 text-sm text-[#555555] font-semibold ">
          Men
        </p>
        <p className="bg-primary px-5 py-3 mb-1  text-sm text-[#555555] font-semibold ">
          Women
        </p>
        <p className=" px-5 py-3  text-sm text-[#555555] font-semibold ">
          Baby
        </p>
        <p className=" px-5 py-3 mb-1  text-sm text-[#555555] font-semibold ">
          Elderly
        </p>
        <p className=" px-5 py-3 mb-1  text-sm text-[#555555] font-semibold ">
          Pre and Post Natal
        </p>
        <p className=" px-5 py-3 mb-3  text-sm text-[#555555] font-semibold ">
          General Vitamins
        </p> */}
        <div className="px-5 border-t-[1px] border-t-[#F2C5C5] border-b-[1px] border-b-[#F2C5C5]  py-4">
          <h4 className="font-semibold text-lg text-[#232738]">
            Filter by Price
          </h4>
          <div className=" my-3 ">
            <Slider
              range
              min={minMax[0]}
              max={minMax[1]}
              className="text-red"
              defaultValue={filters?.price}
              allowCross={false}
              onChange={(e) => handleSliderChange(e)}
            />
          </div>
          <div className="flex justify-between">
            <h2 className="text-xs font-bold">
              {currency}{" "}
              {Math.floor(parseFloat(filters?.price[0].toString()) * currRate)}
            </h2>
            <h2 className="text-xs font-bold">
              {currency}{" "}
              {Math.ceil(parseFloat(filters?.price[1].toString()) * currRate)}
            </h2>
          </div>
        </div>
        {/* <div className="px-5">
          <h4 className="font-semibold text-lg my-4 text-[#232738]">
            Customer Rating
          </h4>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((item: any, idx: number) => {
              return (
                <div className="flex gap-6" key={idx}>
                  <div className="flex  gap-3">
                    <div
                      className={`w-5 h-5   cursor-pointer flex justify-center rounded-sm items-center ${
                        isChecked ? "bg-primary " : "bg-[#F6F6F6]"
                      }`}
                      onClick={toggleCheckbox}
                    >
                      {isChecked && <span>v</span>}
                    </div>
                    <div className="text-primary">
                      &#10027;&#10027;&#10027;&#10027;
                    </div>
                  </div>
                  <div className="font-bold text-xs">&Up</div>
                </div>
              );
            })}
          </div> 
        </div>*/}
      </div>
    </>
  );
};

export default FilterSection;
