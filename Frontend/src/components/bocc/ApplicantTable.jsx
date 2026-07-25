import React from "react";

const rows = [
  {
    name: "Alex Rivera",
    role: "Senior Frontend Engineer",
    position: "Lead UI Designer",
    status: "Under Review",
    applied: "2 hours ago",
  },
  {
    name: "Sarah Chen",
    role: "Data Scientist",
    position: "ML Researcher",
    status: "Shortlisted",
    applied: "5 hours ago",
  },
  {
    name: "Marcus Thorne",
    role: "Product Manager",
    position: "Senior PM",
    status: "Initial Screen",
    applied: "Yesterday",
  },
  {
    name: "Elena Rodriguez",
    role: "Systems Architect",
    position: "Staff Engineer",
    status: "Rejected",
    applied: "2 days ago",
  },
];

const badgeStyles = {
  "Under Review": "bg-[#E5E7EB] text-gray-700",
  Shortlisted: "bg-[#DEF7EC] text-emerald-700",
  "Initial Screen": "bg-[#E5E7EB] text-gray-700",
  Rejected: "bg-[#FDE8E8] text-red-600",
};

const avatarColors = [
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
];

export default function ApplicantTable() {
  return (
    <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEEEEE]">
        <h2 className="text-base font-bold text-black">Recent Applicant Activity</h2>
        <button className="text-xs font-semibold text-gray-500 hover:text-black">
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-semibold tracking-wider text-gray-400 border-b border-[#EEEEEE]">
              <th className="px-5 py-3">CANDIDATE</th>
              <th className="px-5 py-3">POSITION</th>
              <th className="px-5 py-3">STATUS</th>
              <th className="px-5 py-3">APPLIED DATE</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.name}
                className="border-b border-[#F5F5F5] last:border-0 hover:bg-gray-50/50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold ${avatarColors[i % avatarColors.length]}`}
                    >
                      {r.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-black">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-700">{r.position}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold ${badgeStyles[r.status]}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500">{r.applied}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}