import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDraft } from '@/lib/draftContext';
import { useToast } from '@/components/ui/use-toast';
import WizardShell from '@/components/company/WizardShell';
import FileUploadZone from '@/components/company/FileUploadZone';
import InfoPanel from '@/components/company/InfoPanel';

const TextArea = ({ label, subtitle, placeholder, value, onChange, max }) => {
  const len = (value || '').length;
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-black">
        {label} {max !== undefined && <span className="text-red-500">*</span>}
      </label>
      {subtitle && <p className="mb-1.5 text-xs text-gray-400">{subtitle}</p>}
      <textarea
        rows={4}
        maxLength={max}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
      />
      <p className="mt-1 text-right text-xs text-gray-400">
        {len} / {max}
      </p>
    </div>
  );
};

export default function PostOpportunityStep3() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useDraft();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

const handleDocUpload = async (file) => {
  try {
    const fileUrl = URL.createObjectURL(file);

    updateDraft({
      documents: [...(draft.documents || []), fileUrl],
    });

    toast({
      title: "Document uploaded",
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
    // Just keep the draft locally
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
      currentStep={3}
      stepTitle="Step 3: Opportunity Description"
      subtitle="Detail what makes this role unique and what candidates will gain."
      footer={
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/company/post-opportunity/requirements')}
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
              onClick={() => navigate('/company/post-opportunity/preview')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Next Step <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextArea
          label="Opportunity Overview"
          subtitle="High-level summary of the role and its impact within the organization."
          placeholder="Enter a brief overview..."
          value={draft.overview}
          onChange={(v) => updateDraft({ overview: v })}
          max={500}
        />
        <TextArea
          label="Key Responsibilities"
          subtitle="What will the candidate be doing on a daily basis?"
          placeholder="List the primary tasks and expectations..."
          value={draft.responsibilities}
          onChange={(v) => updateDraft({ responsibilities: v })}
          max={1000}
        />
        <TextArea
          label="Learning Outcomes"
          placeholder="What skills will they acquire?"
          value={draft.learning_outcomes}
          onChange={(v) => updateDraft({ learning_outcomes: v })}
          max={400}
        />
        <TextArea
          label="Benefits & Perks"
          placeholder="Insurance, equity, remote-friendly, etc."
          value={draft.benefits}
          onChange={(v) => updateDraft({ benefits: v })}
          max={400}
        />
        <TextArea
          label="Selection Process"
          placeholder="Describe the interview stages (e.g., Portfolio Review -> Technical Round -> HR)"
          value={draft.selection_process}
          onChange={(v) => updateDraft({ selection_process: v })}
          max={300}
        />
        <TextArea
          label="Additional Notes"
          placeholder="Any other relevant details or travel requirements..."
          value={draft.notes}
          onChange={(v) => updateDraft({ notes: v })}
          max={250}
        />
      </div>

      <div className="mt-6">
        <label className="mb-1.5 block text-sm font-medium text-black">Supporting Documents (Optional)</label>
        <FileUploadZone
          accept=".pdf,.doc,.docx,image/jpeg"
          hint="PDF, DOCX or JPEG (Max 10MB)"
          onUpload={handleDocUpload}
          fileUrl={draft.documents?.[0]}
          fileName={draft.documents?.length ? `${draft.documents.length} file(s) attached` : ''}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoPanel icon="bulb" title="Tip: Be Precise">
          Detailed descriptions lead to 40% higher quality applications.
        </InfoPanel>
        <InfoPanel icon="eye" title="Preview Mode">
          See how candidates will view this listing on the portal.
        </InfoPanel>
        <InfoPanel icon="help" title="Need Help?">
          Contact our recruitment consultants for advice.
        </InfoPanel>
      </div>
    </WizardShell>
  );
}