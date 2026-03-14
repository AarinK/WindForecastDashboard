import React from "react";

const DatePicker = ({ value, onChange, label, darkMode }) => (
  <div className="flex flex-col">
    {label && <label className="mb-1 font-medium">{label}</label>}
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`border px-3 py-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 
        transition-colors duration-300
        ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
    />
  </div>
);

export default DatePicker;