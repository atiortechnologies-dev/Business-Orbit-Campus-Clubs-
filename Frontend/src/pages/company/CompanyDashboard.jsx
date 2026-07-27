import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Briefcase, Users, Clock, TrendingUp } from 'lucide-react';

const statCards = [
  { key: 'opportunities', label: 'Active Opportunities', icon: Briefcase },
  { key: 'applicants', label: 'Total Applicants', icon: Users },
  { key: 'new', label: 'New This Week', icon: TrendingUp },
  { key: 'deadline', label: 'Closing Soon', icon: Clock }
];

export default function CompanyDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  try {
    const savedOpportunities = JSON.parse(
      localStorage.getItem("companyOpportunities") || "[]"
    );

    setOpportunities(savedOpportunities);
  } catch (error) {
    setOpportunities([]);
  } finally {
    setLoading(false);
  }
}, []);

  const active = opportunities.filter((o) => o.status === 'active');
  const totalApps = opportunities.reduce((s, o) => s + (o.applications_count || 0), 0);
  const totalNew = opportunities.reduce((s, o) => s + (o.new_count || 0), 0);
  const closingSoon = active.filter((o) => {
    if (!o.deadline) return false;
    const d = new Date(o.deadline);
    const diff = d - new Date();
    return diff > 0 && diff < 7 * 86400000;
  }).length;

  const stats = {
    opportunities: active.length,
    applicants: totalApps,
    new: totalNew,
    deadline: closingSoon
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, Acme Corp. Here's your hiring overview.</p>
        </div>
        <Link
          to="/company/post-opportunity"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <PlusCircle className="h-4 w-4" /> Post Opportunity
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          <div key={c.key} className="rounded-xl border border-[#E5E5E5] bg-white p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <c.icon className="h-4 w-4 text-black" />
            </div>
            <p className="text-2xl font-bold text-black">{loading ? '—' : stats[c.key]}</p>
            <p className="text-xs text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-black">Recent Opportunities</h2>
          <Link to="/company/my-opportunities" className="text-sm font-medium text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-400">Loading...</div>
          ) : opportunities.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">No opportunities yet.</p>
              <Link
                to="/company/post-opportunity"
                className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Post your first opportunity
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E5E5] text-left text-xs uppercase text-gray-400">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Applicants</th>
                  <th className="px-5 py-3 font-medium">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-[#F0F0F0] last:border-0">
                    <td className="px-5 py-3 font-medium text-black">{o.title}</td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          'rounded-full px-2 py-0.5 text-xs font-medium ' +
                          (o.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : o.status === 'closed'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-yellow-100 text-yellow-700')
                        }
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{o.applications_count || 0}</td>
                    <td className="px-5 py-3 text-gray-600">{o.deadline || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}