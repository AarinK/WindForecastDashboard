import React from "react";

const Slider = ({ value, onChange, min = 0, max = 48 }) => (
  <div className="flex flex-col flex-1 min-w-[180px]">
    <label className="mb-1 font-medium">
      Forecast Horizon: {value} hrs
    </label>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
    />
  </div>
);

export default Slider;