import React from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  UserCircle,
  Settings,
  Plus,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/company/dashboard",
  },
  {
    label: "Post Opportunity",
    icon: Plus,
    path: "#",
  },
  {
    label: "My Opportunities",
    icon: FolderOpen,
    path: "/company/my-opportunities",
  },
  {
    label: "Applicants",
    icon: Users,
    path: "#",
  },
  {
    label: "Profile",
    icon: UserCircle,
    path: "#",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "#",
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-[#EEEEEE] bg-white h-screen sticky top-0">

      {/* Logo */}
      <div className="px-6 pt-6 pb-8">
        <h1 className="text-lg font-bold tracking-tight text-black">
          BOCC Platform
        </h1>

        <p className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 mt-0.5">
          ENTERPRISE CONSOLE
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#E5E7EB] text-black"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                )
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}

      </nav>

      {/* Footer */}
      <div className="m-3 p-3 rounded-xl border border-[#EEEEEE] flex items-center gap-3">

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white text-xs font-bold">
          AC
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-black truncate">
            Acme Corp
          </p>

          <p className="text-[11px] text-gray-500 truncate">
            Premium Account
          </p>
        </div>

      </div>

    </aside>
  );
}