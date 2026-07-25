import React from "react";
import { Image as ImageIcon } from "lucide-react";
import Sidebar from "@/components/bocc/Sidebar";
import TopBar from "@/components/bocc/TopBar";
import StatsRow from "@/components/bocc/StatsRow";
import ApplicantTable from "@/components/bocc/ApplicantTable";
import RightPanel from "@/components/bocc/RightPanel";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#F9F9F9]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-black">
                Welcome back, Acme Corp
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                Here is a snapshot of your current hiring pipeline and activity.
              </p>
            </div>
            <div className="w-full lg:w-64 h-32 rounded-xl border border-dashed border-gray-300 bg-white flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-300" />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <StatsRow />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ApplicantTable />
            </div>
            <div className="lg:col-span-1">
              <RightPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}