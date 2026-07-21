'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import IncubatorShell from '@/components/incubator/IncubatorShell';
import ComingSoon from '@/components/ui/ComingSoon';

const INITIAL_APPLICATIONS = [
  {
    id: 'nexus-ai',
    name: 'Nexus AI',
    founder: 'Sarah Chen',
    chapter: 'SF Chapter',
    stage: 'Seed Stage',
    industry: 'DeepTech',
    status: 'NEW', // neutral
  },
  {
    id: 'greenroot',
    name: 'GreenRoot',
    founder: 'Marcus Aurelius',
    chapter: 'Austin Chapter',
    stage: 'Pre-Seed',
    industry: 'Agritech',
    status: 'UNDER_REVIEW', // warning
  },
  {
    id: 'ledgerflow',
    name: 'LedgerFlow',
    founder: 'Jordan Belfort',
    chapter: 'NYC Chapter',
    stage: 'Series A',
    industry: 'Fintech',
    status: 'INTERVIEW_SCHEDULED', // info
  },
  {
    id: 'healthsync',
    name: 'HealthSync',
    founder: 'Elena Rodriguez',
    chapter: 'Chicago Chapter',
    stage: 'Ideation',
    industry: 'Healthtech',
    status: 'NEW', // neutral
  },
  {
    id: 'orbit-analytics',
    name: 'Orbit Analytics',
    founder: 'Sam Altman Jr.',
    chapter: 'LA Chapter',
    stage: 'MVP',
    industry: 'Big Data',
    status: 'REJECTED', // muted
  },
];

// Filter dropdown options are derived from the actual data above — every
// value here appears on at least one row, so every filter combination
// returns something instead of silently going to zero results.
const STAGE_OPTIONS = ['All Stages', 'Ideation', 'MVP', 'Pre-Seed', 'Seed Stage', 'Series A'];
const INDUSTRY_OPTIONS = ['All Industries', 'DeepTech', 'Agritech', 'Fintech', 'Healthtech', 'Big Data'];
const STATUS_OPTIONS = [
  { label: 'All Status', value: 'ALL' },
  { label: 'New', value: 'NEW' },
  { label: 'Under Review', value: 'UNDER_REVIEW' },
  { label: 'Interview Scheduled', value: 'INTERVIEW_SCHEDULED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function ApplicationsQueue() {
  const [stageFilter, setStageFilter] = useState('All Stages');
  const [industryFilter, setIndustryFilter] = useState('All Industries');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleClearFilters = (e) => {
    e.preventDefault();
    setStageFilter('All Stages');
    setIndustryFilter('All Industries');
    setStatusFilter('ALL');
  };

  const visibleApplications = INITIAL_APPLICATIONS.filter((app) => {
    if (stageFilter !== 'All Stages' && app.stage !== stageFilter) return false;
    if (industryFilter !== 'All Industries' && app.industry !== industryFilter) return false;
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="flex items-center gap-1.5 font-poppins font-bold text-xs text-text-heading uppercase select-none">
            <span className="w-2 h-2 rounded-full bg-brand-black dark:bg-white"></span>
            New
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="flex items-center gap-1.5 font-poppins font-bold text-xs text-text-muted uppercase select-none">
            <span className="w-2 h-2 rounded-full bg-border-subtle"></span>
            Under Review
          </span>
        );
      case 'INTERVIEW_SCHEDULED':
        return (
          <span className="flex items-center gap-1.5 font-poppins font-bold text-xs text-text-heading uppercase select-none">
            <span className="w-2 h-2 rounded-full bg-brand-black dark:bg-white"></span>
            Interview Scheduled
          </span>
        );
      case 'REJECTED':
      default:
        return (
          <span className="flex items-center gap-1.5 font-poppins font-bold text-xs text-text-muted/50 dark:text-text-muted/30 uppercase select-none">
            <span className="w-2 h-2 rounded-full bg-border-subtle/50 dark:bg-border-subtle/30"></span>
            Rejected
          </span>
        );
    }
  };

  return (
    <IncubatorShell>
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-poppins font-bold text-headline-lg text-text-heading">
            Incoming Applications
          </h2>
          <p className="text-text-muted mt-1 font-inter text-body-md">
            Review and manage new startup applications for the Spring 2024 cohort.
          </p>
        </div>
        <div className="flex gap-2">
          <ComingSoon label="Filter" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg hover:bg-canvas-bg text-text-heading font-poppins font-semibold text-small cursor-pointer transition-colors">
              <Filter size={14} strokeWidth={2} />
              Filter
            </span>
          </ComingSoon>

          <ComingSoon label="Export" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg hover:bg-canvas-bg text-text-heading font-poppins font-semibold text-small cursor-pointer transition-colors">
              <Download size={14} strokeWidth={2} />
              Export
            </span>
          </ComingSoon>
        </div>
      </section>

      {/* Filters Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-surface-white border border-border-subtle rounded-xl shadow-card transition-colors duration-150 ease-linear">
        <div className="space-y-1">
          <label className="font-poppins font-semibold text-[11px] leading-[16px] text-text-muted uppercase tracking-wider px-1">
            Stage
          </label>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full bg-canvas-bg border border-border-subtle rounded-lg text-text-body font-inter text-body-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
          >
            {STAGE_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="font-poppins font-semibold text-[11px] leading-[16px] text-text-muted uppercase tracking-wider px-1">
            Industry
          </label>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="w-full bg-canvas-bg border border-border-subtle rounded-lg text-text-body font-inter text-body-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
          >
            {INDUSTRY_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="font-poppins font-semibold text-[11px] leading-[16px] text-text-muted uppercase tracking-wider px-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-canvas-bg border border-border-subtle rounded-lg text-text-body font-inter text-body-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
          >
            {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleClearFilters}
            className="w-full text-center py-2 text-text-muted hover:text-text-heading underline underline-offset-4 font-poppins font-semibold text-small transition-colors focus:outline-none"
          >
            Clear all filters
          </button>
        </div>
      </section>

      {/* Applications Grid */}
      <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card overflow-hidden transition-colors duration-150 ease-linear">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[80px_1.5fr_1fr_1fr_1fr_120px] gap-4 px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
          <div className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">
            Logo
          </div>
          <div className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">
            Startup &amp; Founder
          </div>
          <div className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">
            Chapter / Stage
          </div>
          <div className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">
            Industry
          </div>
          <div className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">
            Status
          </div>
          <div className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider text-right">
            Actions
          </div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-border-subtle">
          {visibleApplications.length === 0 && (
            <p className="px-6 py-10 text-center text-text-muted font-inter text-body-md">
              No applications match the current filters.
            </p>
          )}
          {visibleApplications.map((app) => (
            <Link
              key={app.id}
              href="/incubator/applications/review"
              className="grid grid-cols-1 md:grid-cols-[80px_1.5fr_1fr_1fr_1fr_120px] gap-4 px-6 py-6 items-center hover:bg-canvas-bg/30 transition-colors group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading select-none text-sm">
                {app.name.charAt(0)}
              </div>
              <div>
                <p className="font-poppins font-bold text-headline-sm text-text-heading group-hover:text-brand-black transition-colors">
                  {app.name}
                </p>
                <p className="font-inter text-body-md text-text-muted">
                  {app.founder}
                </p>
              </div>
              <div>
                <p className="font-inter text-body-md text-text-heading">
                  {app.chapter}
                </p>
                <p className="font-poppins font-semibold text-[11px] leading-[16px] text-text-muted uppercase tracking-wider">
                  {app.stage}
                </p>
              </div>
              <div>
                <span className="inline-block bg-canvas-bg border border-border-subtle px-2.5 py-1 rounded text-caption font-inter text-text-muted font-medium">
                  {app.industry}
                </span>
              </div>
              <div>
                {getStatusBadge(app.status)}
              </div>
              <div className="flex flex-col gap-1 items-end md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <span className="text-text-heading font-poppins font-semibold text-small hover:underline">
                  View Review
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-subtle bg-canvas-bg/20">
          <p className="text-small text-text-muted font-inter">
            Showing {visibleApplications.length} of 142 applications
          </p>
          <div className="flex items-center gap-2">
            <ComingSoon
              label="Previous Page"
              position="top"
              inline
              className="p-1 rounded border border-border-subtle hover:bg-canvas-bg text-text-muted cursor-not-allowed"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </ComingSoon>
            
            <span className="font-poppins font-semibold text-small px-2 text-text-heading">
              1
            </span>

            <ComingSoon
              label="Next Page"
              position="top"
              inline
              className="p-1 rounded border border-border-subtle hover:bg-canvas-bg text-text-muted cursor-not-allowed"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </ComingSoon>
          </div>
        </div>
      </div>
    </IncubatorShell>
  );
}
