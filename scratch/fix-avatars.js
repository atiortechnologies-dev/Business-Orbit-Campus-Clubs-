const fs = require('fs');
const path = require('path');

const dir = '/home/jimfleax/Business-Orbit-Campus-Clubs-/Frontend/src/components';

const shells = [
  'admin/AdminShell.jsx',
  'company/CompanyShell.jsx',
  'investor/InvestorShell.jsx',
  'mentor/MentorShell.jsx',
  'incubator/IncubatorShell.jsx',
  'dashboard/DashboardShell.jsx'
];

shells.forEach(shell => {
  const filePath = path.join(dir, shell);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import if not exists
  if (!content.includes('useAuth')) {
    content = content.replace(
      'import { useState } from "react";',
      'import { useState } from "react";\nimport { useAuth } from "@/context/AuthContext";'
    );
  }

  // Add user extraction if not exists
  const componentMatch = content.match(/export default function \w+Shell\([^)]*\) \{/);
  if (componentMatch) {
    const componentStart = componentMatch[0];
    if (!content.includes('const { user } = useAuth();')) {
      content = content.replace(
        componentStart,
        `${componentStart}\n  const { user } = useAuth();\n  const initials = user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : user?.first_name ? (user.first_name[0] + (user.last_name ? user.last_name[0] : '')).toUpperCase() : user?.name ? user.name.substring(0,2).toUpperCase() : '??';`
      );
    }
  }

  // Remove footer props
  content = content.replace(/\s+footerInitials="[^"]*"/g, '');
  content = content.replace(/\s+footerName="[^"]*"/g, '');
  content = content.replace(/\s+footerRole="[^"]*"/g, '');

  // Replace hardcoded avatars
  // Examples: >AR</div>, >AC</Link>, >A</div> etc.
  
  // Need to be careful. We can look for the specific div/Link that has the avatar class.
  // 1. AdminShell, InvestorShell, MentorShell
  content = content.replace(
    /(<div className="w-8 h-8 rounded-full overflow-hidden bg-brand-black text-white flex items-center justify-center font-poppins font-semibold text-caption select-none">)\s*[A-Z]{1,2}\s*(<\/div>)/g,
    '$1\n                  {initials}\n                $2'
  );
  
  // 2. CompanyShell
  content = content.replace(
    /(<div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-brand-black text-white flex items-center justify-center font-poppins font-semibold text-caption select-none">)\s*[A-Z]{1,2}\s*(<\/div>)/g,
    '$1\n                  {initials}\n                $2'
  );

  // 3. DashboardShell, IncubatorShell
  content = content.replace(
    /(<Link[^>]*className="w-8 h-8 rounded-full overflow-hidden bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-caption select-none hover:opacity-80 transition-opacity"[^>]*>)\s*[A-Z]{1,2}\s*(<\/Link>)/g,
    '$1\n                {initials}\n              $2'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${shell}`);
});
