import React from "react";
import { Plus } from "lucide-react";
import Sidebar from "@/components/bocc/Sidebar";
import TopBar from "@/components/bocc/TopBar";
import OpportunitiesTable from "@/components/OpportunitiesTable";

export default function MyOpportunities() {
  return (
    <div className="flex min-h-screen bg-[#F9F9F9]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black">
                My Opportunities
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage all your posted opportunities.
              </p>
            </div>

            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
              <Plus className="w-4 h-4" />
              New Opportunity
            </button>
          </div>

          <OpportunitiesTable />
        </main>
      </div>
    </div>
  );
}