// src/components/ui/sidebar.jsx
import React, { createContext, useContext, useState } from "react";
import { cn } from "@/utils"; // or "../lib/utils" if you have utils there

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <SidebarContext.Provider value={{ open, toggle }}>
      <div className="flex">
        <div
          className={cn(
            "h-screen bg-gray-900 text-white transition-all duration-300",
            open ? "w-64" : "w-16"
          )}
        >
          <button
            className="p-2 w-full text-center bg-gray-800 hover:bg-gray-700"
            onClick={toggle}
          >
            {open ? "←" : "☰"}
          </button>
          <nav className="mt-4">
            <ul>
              <li className="p-2 hover:bg-gray-700 cursor-pointer">Dashboard</li>
              <li className="p-2 hover:bg-gray-700 cursor-pointer">Wallet</li>
              <li className="p-2 hover:bg-gray-700 cursor-pointer">Settings</li>
            </ul>
          </nav>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarContext.Provider>
  );
}

export function SidebarTrigger() {
  const { toggle } = useContext(SidebarContext);
  return (
    <button
      onClick={toggle}
      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500"
    >
      Toggle Sidebar
    </button>
  );
}
