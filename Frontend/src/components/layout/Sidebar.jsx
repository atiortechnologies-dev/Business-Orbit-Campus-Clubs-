import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Rocket,
  Users,
  TrendingUp,
  Building2,
  Briefcase,
  UserCircle,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const studentNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Build Startup", icon: Rocket, path: "/build-startup" },
  { label: "Mentors", icon: Users, path: "/mentors" },
  { label: "Investors", icon: TrendingUp, path: "/investors" },
  { label: "Incubators", icon: Building2, path: "/incubators" },
  { label: "Freelancing", icon: Briefcase, path: "/freelancing" }
];

const companyNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/company/dashboard" },
  { label: "Post Opportunity", icon: Rocket, path: "/company/post-opportunity" },
  { label: "My Opportunities", icon: Briefcase, path: "/company/my-opportunities" },
  { label: "Applicants", icon: Users, path: "/company/applicants" },
  { label: "Company Profile", icon: Building2, path: "/company/profile" },
  { label: "Settings", icon: UserCircle, path: "/company/settings" }
];

export default function Sidebar({ open, onClose }) {
const isCompany = location.pathname.startsWith("/company");

const navItems = isCompany
  ? companyNavItems
  : studentNavItems;

const workspaceTitle = isCompany
  ? "Company Workspace"
  : "Student Workspace";

const BrandIcon = isCompany
  ? Building2
  : GraduationCap;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-900 leading-tight">BOCC Portal</p>
              <p className="text-[11px] text-slate-400 leading-tight">Student Workspace</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path) && item.path !== '/'
              ? true
              : location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <UserCircle className="w-[18px] h-[18px]" />
            Profile
          </Link>
          <Link
            to="/help"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <HelpCircle className="w-[18px] h-[18px]" />
            Help
          </Link>
        </div>
      </aside>
    </>
  );
}