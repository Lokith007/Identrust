import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl shadow-md border p-4 bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="mb-2 font-semibold text-lg">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function CardContent({ children }) {
  return <div className="text-gray-700">{children}</div>;
}
