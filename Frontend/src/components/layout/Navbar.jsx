import React from "react";
import { Search, Bell, Settings, Menu } from "lucide-react";

export default function Navbar({
  onMenuClick,
  searchPlaceholder = "Search...",
}) {
  const initials = "BO";

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-16">

        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-100 border border-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">

          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
          </button>

          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <Settings className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
            {initials}
          </div>

        </div>
      </div>
    </header>
  );
}