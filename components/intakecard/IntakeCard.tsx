import React from "react";
import { calculateNutritionPercentage } from "../../utils/utilities";

const IntakeCard = ({ label, value, unit, color, calories }) => {
  return (
    <div className="w-20 h-[6rem] border-2 rounded-b-full border-[#1E003C] mt-8 relative ">
      <p className="text-indigo-950  font-medium text-center ">{label}</p>

      <div
        className={`w-[70%] aspect-square ${color} rounded-full absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center`}
      >
        <p className="text-white text-lg font-normal text-center">
          {value}
          <span className="text-white text-xs font-normal">{unit}</span>
        </p>
        {/* <p className="text-rose-100 text-sm font-normal">
          {calculateNutritionPercentage(label, value, calories)}%
        </p> */}
      </div>
    </div>
  );
};

export default IntakeCard;
