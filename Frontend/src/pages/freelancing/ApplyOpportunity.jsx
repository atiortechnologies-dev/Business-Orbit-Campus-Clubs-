import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UploadCloud, Paperclip, ChevronRight, Check } from 'lucide-react';
import { freelancingService } from '@/lib/freelancingService';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';

function Field({ label, value, required }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 mb-1">{label}{required && <span className="text-rose-500">*</span>}</p>
      <div className="h-10 px-3 flex items-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700">
        {value || '—'}
      </div>
    </div>
  );
}

export default function ApplyOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [availability, setAvailability] = useState('Full-time (40h/week)');
  const [joiningDate, setJoiningDate] = useState('');
  const [additionalDocs, setAdditionalDocs] = useState('');
  const [checklist, setChecklist] = useState({ resume: false, profile: false, skills: true });

  useEffect(() => {
    freelancingService
      .getOpportunity(id)
      .then(setOpp)
      .catch(() => toast({ title: 'Error', description: 'Could not load opportunity.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    setChecklist((c) => ({ ...c, resume: true }));
    try {
      const url = await freelancingService.uploadFile(file);
      setResumeUrl(url);
      toast({ title: 'Resume Uploaded', description: file.name });
    } catch {
      toast({ title: 'Upload Failed', description: 'Could not upload resume.', variant: 'destructive' });
    }
  };

  const validate = () => {
    if (!resumeUrl) {
      toast({ title: 'Resume Required', description: 'Please upload your resume to continue.', variant: 'destructive' });
      return false;
    }
    if (!coverLetter.trim()) {
      toast({ title: 'Cover Letter Required', description: 'Please write a cover letter.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await freelancingService.submitApplication({
        opportunity_id: id,
        job_title: opp?.job_title || '',
        company: opp?.company || '',
        company_logo: opp?.company_logo || '',
        student_name: user?.full_name || 'Student',
        email: user?.email || '',
        phone: '',
        startup_name: '',
        portfolio: portfolioLink,
        linkedin: '',
        resume_url: resumeUrl,
        cover_letter: coverLetter,
        updated_portfolio: portfolioLink,
        availability,
        expected_joining_date: joiningDate,
        additional_documents: additionalDocs,
        status: 'submitted',
        applied_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      toast({ title: 'Application Submitted', description: 'Your application has been sent successfully.' });
      navigate('/freelancing/my-applications');
    } catch {
      toast({ title: 'Submission Failed', description: 'Could not submit application. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    toast({ title: 'Draft Saved', description: 'You can continue your application later.' });
  };

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 rounded-xl border border-slate-200 bg-white animate-pulse" />)}</div>;
  }

  if (!opp) return null;

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Breadcrumb header */}
      <div>
        <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-2">
          <Link to="/freelancing" className="hover:text-slate-600">Freelancing</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/freelancing/opportunity/${id}`} className="hover:text-slate-600">Opportunities</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700 font-medium">Apply</span>
        </nav>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Apply for <span className="text-slate-700">{opp.job_title}</span> at <span className="text-slate-700">{opp.company}</span>
        </h1>
      </div>

      {/* Application Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-900">Application Summary</h2>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">Pre-filled from Profile</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Student Name" value={user?.full_name} />
          <Field label="Email Address" value={user?.email} />
          <Field label="Phone Number" value="+1 (555) 012-3456" />
          <Field label="Startup Name" value="EchoFlow Solutions" />
          <Field label="Portfolio" value="alexrivera.design" />
          <Field label="LinkedIn" value="linkedin.com/in/alexrivera" />
        </div>
      </div>

      {/* Application Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-5">Application Details</h2>

        {/* Resume Upload */}
        <div className="mb-5">
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Resume <span className="text-rose-500">*</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl py-8 flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors"
          >
            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-600">{resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}</p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX up to 10MB</p>
          </div>
          <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />
        </div>

        {/* Cover Letter */}
        <div className="mb-5">
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Cover Letter <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            placeholder="Explain why you are the best fit for this role..."
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Updated Portfolio Link</label>
            <input
              type="text"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Availability</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option>Full-time (40h/week)</option>
              <option>Part-time (20h/week)</option>
              <option>Internship</option>
              <option>Freelance / Contract</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Expected Joining Date</label>
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              placeholder="mm/dd/yyyy"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Additional Documents (Optional)</label>
            <div className="relative">
              <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={additionalDocs}
                onChange={(e) => setAdditionalDocs(e.target.value)}
                placeholder="Attach files..."
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Review Checklist */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Review Checklist</h2>
        <div className="rounded-lg bg-blue-50 p-4 space-y-3">
          {[
            { key: 'resume', label: 'Resume Uploaded' },
            { key: 'profile', label: 'Profile Complete (Bio & Education)' },
            { key: 'skills', label: 'Required Skills Added' }
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2.5 cursor-pointer">
              <button
                type="button"
                onClick={() => setChecklist((c) => ({ ...c, [item.key]: !c[item.key] }))}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  checklist[item.key] ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white'
                }`}
              >
                {checklist[item.key] && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
              <span className={`text-sm ${checklist[item.key] ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="h-10 px-5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveDraft}
          className="h-10 px-5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Save Draft
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="h-10 px-6 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
}