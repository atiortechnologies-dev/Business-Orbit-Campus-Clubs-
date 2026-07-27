import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Briefcase, Users, User, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', to: '/company/dashboard', icon: LayoutDashboard },
  { label: 'Post Opportunity', to: '/company/post-opportunity', icon: PlusCircle },
  { label: 'My Opportunities', to: '/company/my-opportunities', icon: Briefcase },
  { label: 'Applicants', to: '/company/applicants', icon: Users },
  { label: 'Profile', to: '/company/profile', icon: User },
  { label: 'Settings', to: '/company/settings', icon: Settings }
];

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-[#E5E5E5] bg-white">
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
            <span className="text-sm font-bold">B</span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-black">BOCC Platform</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Enterprise Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#E5E5E5] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
            AC
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-black">Acme Corp</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Premium Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}