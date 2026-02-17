
// SearchBar.jsx
import React from "react";

const SearchBar = React.memo(({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search for dishes..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-full border border-gray-300 bg-white shadow-md
        focus:border-green-500 focus:ring-2 focus:ring-green-200
        transition duration-300 ease-in-out
        pl-4 pr-12 py-3 text-gray-700 placeholder-gray-400 outline-none"
    />
  );
});

export default SearchBar;
