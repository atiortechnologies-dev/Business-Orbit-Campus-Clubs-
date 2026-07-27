import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDraft } from '@/lib/draftContext';
import { useToast } from '@/components/ui/use-toast';
import WizardShell from '@/components/company/WizardShell';
import TagInput from '@/components/company/TagInput';
import InfoPanel from '@/components/company/InfoPanel';

const fieldLabel = (label, required) => (
  <label className="mb-1.5 block text-sm font-medium text-black">
    {label} {required && <span className="text-red-500">*</span>}
  </label>
);

const inputCls =
  'h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none';

const years = ['2021', '2022', '2023', '2024', '2025', '2026'];

export default function PostOpportunityStep2() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useDraft();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [branchInput, setBranchInput] = useState('');

  const toggleYear = (y) => {
    const set = new Set(draft.passing_years);
    if (set.has(y)) set.delete(y);
    else set.add(y);
    updateDraft({ passing_years: [...set] });
  };

  const addBranch = () => {
    const v = branchInput.trim();
    if (v && !draft.branches.includes(v)) updateDraft({ branches: [...draft.branches, v] });
    setBranchInput('');
  };

const saveDraft = async () => {
  setSaving(true);

  try {
    // Save draft locally
    updateDraft({
      ...draft,
      status: "draft",
    });

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
    setSaving(false);
  }
};

  return (
    <WizardShell
      currentStep={2}
      stepTitle="Step 2: Requirements & Eligibility"
      subtitle="Define the criteria candidates must meet to apply."
      footer={
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/company/post-opportunity')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={saveDraft}
              disabled={saving}
              className="rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => navigate('/company/post-opportunity/description')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Next Step <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      }
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-black">Candidate Eligibility</h3>
        <p className="mt-0.5 text-sm text-gray-500">
          Define the minimum criteria for this role to filter high-quality applicants.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          {fieldLabel('Required Skills')}
          <TagInput
            tags={draft.skills}
            onChange={(skills) => updateDraft({ skills })}
            placeholder="Type a skill and press Enter..."
          />
        </div>
        <div>
          {fieldLabel('Minimum Education')}
          <select
            className={inputCls}
            value={draft.min_education}
            onChange={(e) => updateDraft({ min_education: e.target.value })}
          >
            {['High School', "Associate's Degree", "Bachelor's Degree", "Master's Degree", 'PhD'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          {fieldLabel('Minimum CGPA')}
          <input
            className={inputCls}
            placeholder="e.g. 7.5"
            value={draft.min_cgpa}
            onChange={(e) => updateDraft({ min_cgpa: e.target.value })}
          />
        </div>
        <div>
          {fieldLabel('Experience Required (Years)')}
          <select
            className={inputCls}
            value={draft.experience}
            onChange={(e) => updateDraft({ experience: e.target.value })}
          >
            {['0-1 Years (Entry)', '1-3 Years', '3-5 Years', '5+ Years'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        {fieldLabel('Eligible Passing Years')}
        <div className="flex flex-wrap gap-2">
          {years.map((y) => {
            const active = draft.passing_years.includes(y);
            return (
              <button
                key={y}
                type="button"
                onClick={() => toggleYear(y)}
                className={
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                  (active ? 'bg-black text-white' : 'border border-[#E5E5E5] bg-white text-black hover:bg-gray-50')
                }
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        {fieldLabel('Eligible Branches')}
        <div className="flex flex-wrap items-center gap-2">
          {draft.branches.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white"
            >
              {b}
              <button
                type="button"
                onClick={() => updateDraft({ branches: draft.branches.filter((x) => x !== b) })}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </span>
          ))}
          <div className="inline-flex items-center gap-1">
            <input
              className="h-8 w-40 rounded-md border border-[#E5E5E5] px-2 text-sm focus:border-black focus:outline-none"
              placeholder="Add Branch"
              value={branchInput}
              onChange={(e) => setBranchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBranch();
                }
              }}
            />
            <button
              type="button"
              onClick={addBranch}
              className="inline-flex items-center gap-1 rounded-md border border-[#E5E5E5] px-2.5 py-1.5 text-xs font-medium text-black hover:bg-gray-50"
            >
              + Add Branch
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          {fieldLabel('Previous Startup Experience')}
          <select
            className={inputCls}
            value={draft.startup_exp}
            onChange={(e) => updateDraft({ startup_exp: e.target.value })}
          >
            {['Required', 'Preferred', 'Not Required'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          {fieldLabel('Languages')}
          <TagInput
            tags={draft.languages}
            onChange={(languages) => updateDraft({ languages })}
            placeholder="e.g. English, Spanish, Hindi"
          />
        </div>
      </div>

      <div className="mt-6">
        <InfoPanel icon="bulb" title="Pro Tip">
          Defining clear eligibility criteria can reduce manual screening time by up to 60%. Our AI assistant will
          automatically score candidates based on these parameters.
        </InfoPanel>
      </div>
    </WizardShell>
  );
}