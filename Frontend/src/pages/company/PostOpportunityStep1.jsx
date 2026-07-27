import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useDraft } from '@/lib/draftContext';
import { useToast } from '@/components/ui/use-toast';
import WizardShell from '@/components/company/WizardShell';
import FileUploadZone from '@/components/company/FileUploadZone';
import InfoPanel from '@/components/company/InfoPanel';

const fieldLabel = (label, required) => (
  <label className="mb-1.5 block text-sm font-medium text-black">
    {label} {required && <span className="text-red-500">*</span>}
  </label>
);

const inputCls =
  'h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none';

export default function PostOpportunityStep1() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useDraft();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

const handleLogoUpload = async (file) => {
  try {
    const fileUrl = URL.createObjectURL(file);

    updateDraft({
      logo_url: fileUrl,
    });

    toast({
      title: "Logo uploaded",
    });
  } catch (e) {
    toast({
      title: "Upload failed",
      description: e.message,
      variant: "destructive",
    });
  }
};

const saveDraft = async () => {
  setSaving(true);

  try {
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

  const next = () => {
    if (!draft.title) {
      toast({ title: 'Opportunity Title is required', variant: 'destructive' });
      return;
    }
    navigate('/company/post-opportunity/requirements');
  };

  return (
    <WizardShell
      currentStep={1}
      stepTitle="Step 1: Basic Information"
      footer={
        <div className="flex items-center justify-between">
          <button
            onClick={saveDraft}
            disabled={saving}
            className="rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/company/dashboard')}
              className="text-sm font-medium text-gray-500 hover:text-black"
            >
              Cancel
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Next Step <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          {fieldLabel('Opportunity Title', true)}
          <input
            className={inputCls}
            placeholder="e.g. Senior Frontend Engineer"
            value={draft.title}
            onChange={(e) => updateDraft({ title: e.target.value })}
          />
        </div>
        <div>
          {fieldLabel('Opportunity Type', true)}
          <select
            className={inputCls}
            value={draft.type}
            onChange={(e) => updateDraft({ type: e.target.value })}
          >
            {['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          {fieldLabel('Industry')}
          <input
            className={inputCls}
            placeholder="Select Industry..."
            value={draft.industry}
            onChange={(e) => updateDraft({ industry: e.target.value })}
          />
        </div>
        <div>
          {fieldLabel('Work Mode', true)}
          <select
            className={inputCls}
            value={draft.work_mode}
            onChange={(e) => updateDraft({ work_mode: e.target.value })}
          >
            {['Remote', 'On-site', 'Hybrid'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          {fieldLabel('Department')}
          <input
            className={inputCls}
            placeholder="e.g. Engineering"
            value={draft.department}
            onChange={(e) => updateDraft({ department: e.target.value })}
          />
        </div>
        <div>
          {fieldLabel('Location')}
          <input
            className={inputCls}
            placeholder="e.g. New York, NY"
            value={draft.location}
            onChange={(e) => updateDraft({ location: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="md:col-span-1">
          {fieldLabel('Company Logo')}
          <FileUploadZone
            accept="image/svg,image/png,image/jpeg"
            hint="SVG, PNG, JPG (max. 800x400px)"
            fileUrl={draft.logo_url}
            onUpload={handleLogoUpload}
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            {fieldLabel('Duration')}
            <input
              className={inputCls}
              placeholder="e.g. 6 Months"
              value={draft.duration}
              onChange={(e) => updateDraft({ duration: e.target.value })}
            />
          </div>
          <div>
            {fieldLabel('No. of Openings', true)}
            <input
              type="number"
              min="1"
              className={inputCls}
              value={draft.openings}
              onChange={(e) => updateDraft({ openings: Number(e.target.value) })}
            />
          </div>
          <div>
            {fieldLabel('Application Deadline')}
            <input
              type="date"
              className={inputCls}
              value={draft.deadline}
              onChange={(e) => updateDraft({ deadline: e.target.value })}
            />
          </div>
          <div>
            {fieldLabel('Salary / Stipend Range')}
            <input
              className={inputCls}
              placeholder="e.g. $80k - $120k"
              value={draft.salary}
              onChange={(e) => updateDraft({ salary: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoPanel icon="info" title="Optimization Tip">
          Listing a clear salary range and work mode increases application quality by up to 35%.
        </InfoPanel>
        <InfoPanel icon="shield" title="Privacy Control">
          Your company details are never shared with candidates until you choose to reveal them.
        </InfoPanel>
      </div>
    </WizardShell>
  );
}