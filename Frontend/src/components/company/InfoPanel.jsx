import React from 'react';
import { Info, ShieldCheck, Lightbulb, Eye, LifeBuoy } from 'lucide-react';

const iconMap = {
  info: Info,
  shield: ShieldCheck,
  bulb: Lightbulb,
  eye: Eye,
  help: LifeBuoy
};

export default function InfoPanel({ icon = 'info', title, children }) {
  const Icon = iconMap[icon] || Info;
  return (
    <div className="flex items-start gap-3 rounded-lg bg-[#F3F3F3] p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
      <div>
        {title && <p className="text-sm font-semibold text-black">{title}</p>}
        <p className="text-xs leading-relaxed text-gray-500">{children}</p>
      </div>
    </div>
  );
}