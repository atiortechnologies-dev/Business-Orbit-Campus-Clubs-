import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Filter, ArrowUpDown, Download, FileText, Pencil, Ban, ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useDraft } from '@/lib/draftContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

const statusStyles = {
  new: 'bg-gray-100 text-gray-700',
  under_review: 'bg-gray-100 text-gray-700',
  shortlisted: 'bg-black text-white',
  interview: 'bg-blue-100 text-blue-700',
  selected: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
};

const selectCls =
  'h-9 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-sm text-black focus:border-black focus:outline-none';

const PAGE_SIZE = 10;

export default function ApplicantsList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loadDraft } = useDraft();
  const [opportunity, setOpportunity] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', college: '', skill: '', year: '' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [closeOpen, setCloseOpen] = useState(false);

useEffect(() => {
  if (!id) return;

  const loadData = async () => {
    setLoading(true);

    try {
      const opportunity = await companyService.getOpportunity(id);

      const allApplicants = JSON.parse(
        localStorage.getItem("companyApplicants") || "[]"
      );

      const applicants = allApplicants.filter(
        (applicant) => applicant.opportunity_id === id
      );

      setOpportunity(opportunity);
      setApplicants(applicants);
    } catch (error) {
      console.error("Error loading applicants:", error);
      setOpportunity(null);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [id]);

  const colleges = [...new Set(applicants.map((a) => a.college).filter(Boolean))];
  const skills = [...new Set(applicants.flatMap((a) => a.skills || []))];
  const years = [...new Set(applicants.map((a) => a.grad_year).filter(Boolean))];

  const filtered = applicants.filter((a) => {
    if (filters.status && a.status !== filters.status) return false;
    if (filters.college && a.college !== filters.college) return false;
    if (filters.skill && !(a.skills || []).includes(filters.skill)) return false;
    if (filters.year && a.grad_year !== filters.year) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const toggleSelect = (appId) => {
    setSelected((prev) => (prev.includes(appId) ? prev.filter((x) => x !== appId) : [...prev, appId]));
  };

  const exportCsv = () => {
    const rows = [
      ['Name', 'Email', 'College', 'Degree', 'Grad Year', 'Skills', 'Applied', 'Status'],
      ...filtered.map((a) => [
        a.name,
        a.email,
        a.college,
        a.degree,
        a.grad_year,
        (a.skills || []).join('; '),
        a.applied_date,
        a.status
      ])
    ];
    const csv = rows.map((r) => r.map((c) => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applicants-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported applicants' });
  };

const closeOpportunity = async () => {
  try {
    const updated = await companyService.updateOpportunity(id, {
      status: "closed",
    });

    if (!updated) {
      throw new Error("Opportunity not found");
    }

    setOpportunity(updated);

    toast({
      title: "Opportunity closed",
    });

    setCloseOpen(false);
  } catch (e) {
    toast({
      title: "Failed to close",
      description: e.message,
      variant: "destructive",
    });
  }
};

  const clearFilters = () => setFilters({ status: '', college: '', skill: '', year: '' });

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        to="/company/my-opportunities"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" /> Return to My Opportunities
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Applicants</h1>
          <p className="mt-1 text-sm text-gray-500">Review applications for {opportunity?.title || 'this opportunity'}.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] px-3 py-2 text-xs font-medium text-black hover:bg-gray-50">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] px-3 py-2 text-xs font-medium text-black hover:bg-gray-50">
            <ArrowUpDown className="h-3.5 w-3.5" /> Sort
          </button>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] px-3 py-2 text-xs font-medium text-black hover:bg-gray-50"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Opportunity summary */}
      {opportunity && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E5E5E5] bg-white p-5">
          <div>
            <h3 className="text-base font-semibold text-black">{opportunity.title}</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {[opportunity.department, opportunity.type, `Deadline: ${opportunity.deadline || '—'}`]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xl font-bold text-black">{opportunity.applications_count || applicants.length}</p>
              <p className="text-[10px] uppercase text-gray-400">Applicants</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-black">{opportunity.new_count || applicants.filter((a) => a.status === 'new').length}</p>
              <p className="text-[10px] uppercase text-gray-400">New</p>
            </div>
            <span
              className={
                'rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ' +
                (opportunity.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : opportunity.status === 'closed'
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-yellow-100 text-yellow-700')
              }
            >
              {opportunity.status}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  loadDraft(opportunity);
                  window.location.href = '/company/post-opportunity/preview';
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-50"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit Opportunity
              </button>
              <button
                onClick={() => setCloseOpen(true)}
                disabled={opportunity.status === 'closed'}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
              >
                <Ban className="h-3.5 w-3.5" /> Close Opportunity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select className={selectCls} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          {['new', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected'].map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
        <select className={selectCls} value={filters.college} onChange={(e) => setFilters({ ...filters, college: e.target.value })}>
          <option value="">All Colleges</option>
          {colleges.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className={selectCls} value={filters.skill} onChange={(e) => setFilters({ ...filters, skill: e.target.value })}>
          <option value="">All Skills</option>
          {skills.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className={selectCls} value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
          <option value="">Grad Year</option>
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
        {(filters.status || filters.college || filters.skill || filters.year) && (
          <button onClick={clearFilters} className="text-xs font-medium text-blue-600 hover:underline">
            Clear all filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading applicants...</div>
        ) : pageItems.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No applicants found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E5E5] text-left text-xs uppercase text-gray-400">
                  <th className="px-4 py-3 font-medium">
                    <input type="checkbox" className="h-4 w-4 accent-black" />
                  </th>
                  <th className="px-4 py-3 font-medium">Applicant</th>
                  <th className="px-4 py-3 font-medium">College</th>
                  <th className="px-4 py-3 font-medium">Degree & Grad</th>
                  <th className="px-4 py-3 font-medium">Skills</th>
                  <th className="px-4 py-3 font-medium">Startup Exp</th>
                  <th className="px-4 py-3 font-medium">Applied</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => navigate(`/company/applicant/${a.id}`)}
                    className="cursor-pointer border-b border-[#F0F0F0] text-black last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.includes(a.id)}
                        onChange={() => toggleSelect(a.id)}
                        className="h-4 w-4 accent-black"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-black">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.college}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.degree}
                      {a.grad_year ? `, ${a.grad_year}` : ''}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(a.skills || []).slice(0, 2).map((s) => (
                          <span key={s} className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
                            {s}
                          </span>
                        ))}
                        {(a.skills || []).length > 2 && (
                          <span className="text-xs text-gray-400">+{a.skills.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {a.startup_exp ? (
                        <Check className="h-4 w-4 text-black" />
                      ) : (
                        <span className="block h-4 w-4 rounded-full border border-gray-300" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.applied_date || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          'rounded-full px-2 py-0.5 text-xs font-medium capitalize ' +
                          (statusStyles[a.status] || 'bg-gray-100 text-gray-700')
                        }
                      >
                        {a.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/company/applicant/${a.id}`);
                        }}
                        className="text-gray-500 hover:text-black"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#E5E5E5] px-4 py-3 text-xs text-gray-500">
            <span>
              Showing {(current - 1) * PAGE_SIZE + 1}-{Math.min(current * PAGE_SIZE, filtered.length)} of{' '}
              {filtered.length} applicants
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(current - 1)}
                disabled={current === 1}
                className="flex h-7 w-7 items-center justify-center rounded border border-[#E5E5E5] disabled:opacity-40 hover:bg-gray-50"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={
                      'flex h-7 w-7 items-center justify-center rounded border text-xs ' +
                      (p === current ? 'border-black bg-black text-white' : 'border-[#E5E5E5] hover:bg-gray-50')
                    }
                  >
                    {p}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="px-1">...</span>}
              <button
                onClick={() => setPage(current + 1)}
                disabled={current === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded border border-[#E5E5E5] disabled:opacity-40 hover:bg-gray-50"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={closeOpen} onOpenChange={setCloseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close this opportunity?</AlertDialogTitle>
            <AlertDialogDescription>
              The opportunity will no longer accept new applications. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={closeOpportunity} className="bg-black text-white hover:bg-gray-800">
              Close Opportunity
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}