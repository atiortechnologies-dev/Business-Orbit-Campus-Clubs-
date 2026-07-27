import React from 'react';
import { Search, Bell, MessageSquare, Settings as SettingsIcon, Menu } from 'lucide-react';

export default function Navbar({ title, onMenuClick }) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-[#E5E5E5] bg-white px-6">
      <div className="flex flex-1 items-center">
        <button
          onClick={onMenuClick}
          className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates, jobs..."
            className="h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#F9F9F9] pl-9 pr-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
          />
        </div>
        {title && <h2 className="ml-4 hidden text-base font-semibold text-black lg:block">{title}</h2>}
      </div>

      <div className="flex items-center gap-1">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-black">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-black">
          <MessageSquare className="h-[18px] w-[18px]" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-black">
          <SettingsIcon className="h-[18px] w-[18px]" />
        </button>
        <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
          AC
        </div>
      </div>
    </header>
  );
}