import React from "react";

export function Switch({ checked, onChange, className = "" }) {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <span className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={`block w-10 h-6 rounded-full transition ${
            checked ? "bg-blue-600" : "bg-gray-300"
          }`}
        ></span>
        <span
          className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition ${
            checked ? "translate-x-4" : ""
          }`}
        ></span>
      </span>
    </label>
  );
}
