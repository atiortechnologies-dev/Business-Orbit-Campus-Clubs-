import React from "react";
import { Search, Bell } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 bg-[#F9F9F9]/80 backdrop-blur-md border-b border-[#EEEEEE]">
      <div className="flex items-center gap-4 px-6 py-3.5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates, jobs..."
            className="w-full h-9 pl-10 pr-4 rounded-lg bg-white border border-[#EEEEEE] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button className="relative w-9 h-9 rounded-lg bg-white border border-[#EEEEEE] flex items-center justify-center text-gray-600 hover:bg-gray-50">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white text-xs font-bold">
              AC
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}