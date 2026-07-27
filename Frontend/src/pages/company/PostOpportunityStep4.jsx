import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Check, ArrowRight, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { companyService } from '@/lib/companyService';
import { useDraft } from '@/lib/draftContext';
import { useToast } from '@/components/ui/use-toast';
import WizardShell from '@/components/company/WizardShell';

const checklist = [
  { label: 'Role Details', editTo: '/company/post-opportunity' },
  { label: 'Criteria & Skills', editTo: '/company/post-opportunity/requirements' },
  { label: 'Perks & Benefits', editTo: '/company/post-opportunity/description' }
];

const visibilityOptions = [
  { value: 'public', title: 'Public', desc: 'Visible to all students on the portal.' },
  { value: 'members', title: 'BOCC Members Only', desc: 'Only verified students can view this opportunity.' },
  { value: 'colleges', title: 'Selected Colleges', desc: 'Restrict visibility to specific partner colleges.' }
];

export default function PostOpportunityStep4() {
  const navigate = useNavigate();
  const { draft, updateDraft, resetDraft } = useDraft();
  const { toast } = useToast();
  const [publishing, setPublishing] = useState(false);

const publish = async () => {
  if (!draft.title) {
    toast({
      title: "Opportunity Title is required",
      variant: "destructive",
    });
    navigate("/company/post-opportunity");
    return;
  }

  setPublishing(true);

  try {
    const payload = {
      ...draft,
      status: "active",
    };

    if (draft.id) {
      await companyService.updateOpportunity(draft.id, payload);
    } else {
      const saved = await companyService.createOpportunity(payload);
      updateDraft({ id: saved.id });
    }

    toast({
      title: "Opportunity published successfully!",
    });

    resetDraft();
    navigate("/company/my-opportunities");
  } catch (e) {
    toast({
      title: "Publish failed",
      description: e.message,
      variant: "destructive",
    });
  } finally {
    setPublishing(false);
  }
};

const saveDraft = async () => {
  setPublishing(true);

  try {
    const payload = {
      ...draft,
      status: "draft",
    };

    if (draft.id) {
      await companyService.updateOpportunity(draft.id, payload);
    } else {
      const saved = await companyService.createOpportunity(payload);
      updateDraft({ id: saved.id });
    }

    toast({
      title: "Draft saved",
    });
  } catch (e) {
    toast({
      title: "Save failed",
      description: e.message,
      variant: "destructive",
    });
  } finally {
    setPublishing(false);
  }
};
  return (
    <WizardShell
      currentStep={4}
      stepTitle="Step 4: Preview & Publish"
      subtitle="Review how your opportunity will appear to students and configure final visibility settings."
      footer={
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/company/post-opportunity/description')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={saveDraft}
              disabled={publishing}
              className="rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={publish}
              disabled={publishing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              Publish Opportunity <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Live Preview */}
        <div>
          <div className="mb-2 inline-block rounded-md bg-black px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            Live Preview (Student View)
          </div>
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
            <h3 className="text-lg font-bold text-black">{draft.title || 'Untitled Opportunity'}</h3>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {draft.location || '—'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" /> {draft.type}
              </span>
              <span className="inline-flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" /> {draft.salary || '—'}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-gray-400">About the Role</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {draft.overview || 'No overview provided yet.'}
              </p>
            </div>

            {draft.skills?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-gray-400">Requirements / Skills</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {draft.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-semibold text-white">
              Apply Now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-5">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-black">Review Checklist</h3>
            <div className="space-y-3">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm text-black">{item.label}</span>
                  </div>
                  <Link to={item.editTo} className="text-xs font-medium text-blue-600 hover:underline">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-black">Visibility Settings</h3>
            <div className="space-y-3">
              {visibilityOptions.map((opt) => {
                const checked = draft.visibility === opt.value;
                return (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#E5E5E5] p-3 hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="visibility"
                      checked={checked}
                      onChange={() => updateDraft({ visibility: opt.value })}
                      className="mt-0.5 h-4 w-4 accent-black"
                    />
                    <div>
                      <p className="text-sm font-medium text-black">{opt.title}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-black">Application Deadline</label>
              <input
                type="date"
                value={draft.deadline}
                onChange={(e) => updateDraft({ deadline: e.target.value })}
                className="h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-sm focus:border-black focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </WizardShell>
  );
}