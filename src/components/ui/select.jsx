import React, { useState } from "react";

export function Select({ children, onValueChange }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSelect = (val) => {
    setValue(val);
    setOpen(false);
    if (onValueChange) onValueChange(val);
  };

  return (
    <div className="relative inline-block w-48">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { open, setOpen, value, onSelect: handleSelect })
      )}
    </div>
  );
}

export function SelectTrigger({ children, setOpen }) {
  return (
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className="w-full px-3 py-2 border rounded-lg bg-white text-left"
    >
      {children}
    </button>
  );
}

export function SelectValue({ value, placeholder = "Select option" }) {
  return <span>{value || placeholder}</span>;
}

export function SelectContent({ children, open }) {
  if (!open) return null;
  return (
    <ul className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg">
      {children}
    </ul>
  );
}

export function SelectItem({ children, onSelect, value }) {
  return (
    <li
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => onSelect(value)}
    >
      {children}
    </li>
  );
}
