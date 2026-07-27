import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Users, Pencil, Ban } from 'lucide-react';
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

export default function MyOpportunities() {
  const { toast } = useToast();
  const { loadDraft } = useDraft();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closeTarget, setCloseTarget] = useState(null);

const refresh = () => {
  setLoading(true);

  try {
    const data = JSON.parse(
      localStorage.getItem("companyOpportunities") || "[]"
    );

    setOpportunities(data);
  } catch {
    setOpportunities([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    refresh();
  }, []);

  const editOpportunity = (opp) => {
    loadDraft(opp);
    window.location.href = '/company/post-opportunity/preview';
  };

const closeOpportunity = () => {
  if (!closeTarget) return;

  try {
    const data = JSON.parse(
      localStorage.getItem("companyOpportunities") || "[]"
    );

    const updated = data.map((item) =>
      item.id === closeTarget
        ? { ...item, status: "closed" }
        : item
    );

    localStorage.setItem(
      "companyOpportunities",
      JSON.stringify(updated)
    );

    toast({
      title: "Opportunity closed"
    });

    setCloseTarget(null);

    refresh();
  } catch (e) {
    toast({
      title: "Failed to close",
      description: e.message,
      variant: "destructive"
    });
  }
};

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">My Opportunities</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your posted opportunities and track applications.</p>
        </div>
        <Link
          to="/company/post-opportunity"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <PlusCircle className="h-4 w-4" /> Post Opportunity
        </Link>
      </div>

      {loading ? (
        <div className="rounded-xl border border-[#E5E5E5] bg-white p-8 text-center text-sm text-gray-400">
          Loading...
        </div>
      ) : opportunities.length === 0 ? (
        <div className="rounded-xl border border-[#E5E5E5] bg-white p-12 text-center">
          <p className="text-sm text-gray-500">You haven't posted any opportunities yet.</p>
          <Link
            to="/company/post-opportunity"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Post your first opportunity
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {opportunities.map((o) => (
            <div key={o.id} className="rounded-xl border border-[#E5E5E5] bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-black">{o.title}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {[o.department, o.type, o.work_mode].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span
                  className={
                    'rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ' +
                    (o.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : o.status === 'closed'
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-yellow-100 text-yellow-700')
                  }
                >
                  {o.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-[#F9F9F9] py-2">
                  <p className="text-lg font-bold text-black">{o.applications_count || 0}</p>
                  <p className="text-[10px] uppercase text-gray-400">Applicants</p>
                </div>
                <div className="rounded-lg bg-[#F9F9F9] py-2">
                  <p className="text-lg font-bold text-black">{o.new_count || 0}</p>
                  <p className="text-[10px] uppercase text-gray-400">New</p>
                </div>
                <div className="rounded-lg bg-[#F9F9F9] py-2">
                  <p className="text-sm font-semibold text-black">{o.deadline || '—'}</p>
                  <p className="text-[10px] uppercase text-gray-400">Deadline</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  to={`/company/opportunity/${o.id}/applicants`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-black px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                >
                  <Users className="h-3.5 w-3.5" /> View Applicants
                </Link>
                <button
                  onClick={() => editOpportunity(o)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E5E5] px-3 py-2 text-xs font-medium text-black hover:bg-gray-50"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => setCloseTarget(o.id)}
                  disabled={o.status === 'closed'}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E5E5] px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
                >
                  <Ban className="h-3.5 w-3.5" /> Close
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!closeTarget} onOpenChange={(open) => !open && setCloseTarget(null)}>
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