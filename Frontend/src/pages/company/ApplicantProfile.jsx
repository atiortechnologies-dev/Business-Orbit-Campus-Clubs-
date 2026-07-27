import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Link as LinkIcon,
  Code,
  Download,
  CalendarClock,
  ArrowUpRight,
  X,
  Share2,
  Maximize2,
  FileText
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';

const statuses = ['new', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected'];

export default function ApplicantProfile() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('new');
  const [savingStatus, setSavingStatus] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [interview, setInterview] = useState({ date: '', time: '', mode: 'Video Call', notes: '' });

useEffect(() => {
  if (!applicationId) return;

  setLoading(true);

  try {
    const applicants = JSON.parse(
      localStorage.getItem("companyApplicants") || "[]"
    );

    const applicant = applicants.find(
      (item) => item.id === applicationId
    );

    if (applicant) {
      setApplicant(applicant);
      setStatus(applicant.status || "new");
      setNotes(applicant.recruiter_notes || "");
    } else {
      setApplicant(null);
    }
  } catch (error) {
    setApplicant(null);
  } finally {
    setLoading(false);
  }
}, [applicationId]);

const updateStatus = async (newStatus) => {
  setSavingStatus(true);

  try {
    const applicants = JSON.parse(
      localStorage.getItem("companyApplicants") || "[]"
    );

    const index = applicants.findIndex(
      (item) => item.id === applicationId
    );

    if (index === -1) {
      throw new Error("Applicant not found");
    }

    applicants[index] = {
      ...applicants[index],
      status: newStatus,
    };

    localStorage.setItem(
      "companyApplicants",
      JSON.stringify(applicants)
    );

    setApplicant(applicants[index]);
    setStatus(newStatus);

    toast({
      title: `Status updated to ${newStatus.replace("_", " ")}`,
    });
  } catch (e) {
    toast({
      title: "Update failed",
      description: e.message,
      variant: "destructive",
    });
  } finally {
    setSavingStatus(false);
  }
};

const saveNotes = async () => {
  try {
    const applicants = JSON.parse(
      localStorage.getItem("companyApplicants") || "[]"
    );

    const index = applicants.findIndex(
      (item) => item.id === applicationId
    );

    if (index === -1) {
      throw new Error("Applicant not found");
    }

    applicants[index] = {
      ...applicants[index],
      recruiter_notes: notes,
    };

    localStorage.setItem(
      "companyApplicants",
      JSON.stringify(applicants)
    );

    setApplicant(applicants[index]);

    toast({
      title: "Notes saved",
    });
  } catch (e) {
    toast({
      title: "Save failed",
      description: e.message,
      variant: "destructive",
    });
  }
};

  const downloadResume = async () => {
  if (!applicant?.resume_url) {
    toast({
      title: "No resume available",
      variant: "destructive",
    });
    return;
  }

  try {
    const a = document.createElement("a");
    a.href = applicant.resume_url;
    a.target = "_blank";
    a.download = `${applicant.name}-resume.pdf`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Resume download started",
    });
  } catch (e) {
    window.open(applicant.resume_url, "_blank");

    toast({
      title: "Opened resume in new tab",
    });
  }
};

const scheduleInterview = async () => {
  try {
    const applicants = JSON.parse(
      localStorage.getItem("companyApplicants") || "[]"
    );

    const index = applicants.findIndex(
      (item) => item.id === applicationId
    );

    if (index === -1) {
      throw new Error("Applicant not found");
    }

    applicants[index] = {
      ...applicants[index],
      status: "interview",
      interview: {
        date: interview.date,
        time: interview.time,
        mode: interview.mode,
        notes: interview.notes,
      },
    };

    localStorage.setItem(
      "companyApplicants",
      JSON.stringify(applicants)
    );

    setApplicant(applicants[index]);
    setStatus("interview");

    toast({
      title: "Interview scheduled",
      description: `${interview.date} at ${interview.time} · ${interview.mode}`,
    });

    setInterviewOpen(false);
    setInterview({
      date: "",
      time: "",
      mode: "Video Call",
      notes: "",
    });
  } catch (e) {
    toast({
      title: "Scheduling failed",
      description: e.message,
      variant: "destructive",
    });
  }
};

  const contactApplicant = () => {
    if (applicant?.email) {
      window.location.href = `mailto:${applicant.email}?subject=Regarding your application`;
    } else {
      toast({ title: 'No email on file', variant: 'destructive' });
    }
  };

  const rejectApplicant = async () => {
    await updateStatus('rejected');
    setRejectOpen(false);
  };

  const shareProfile = () => {
    const link = `${window.location.origin}/company/applicant/${applicationId}?share=${Date.now()}`;
    setShareLink(link);
    setShareOpen(true);
    navigator.clipboard?.writeText(link).catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">Loading applicant...</div>
    );
  }

  if (!applicant) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8 text-center">
        <p className="text-sm text-gray-500">Applicant not found.</p>
        <Link to="/company/applicants" className="mt-2 text-sm text-blue-600 hover:underline">
          Back to applicants
        </Link>
      </div>
    );
  }

  const initials = applicant.name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        to={applicant.opportunity_id ? `/company/opportunity/${applicant.opportunity_id}/applicants` : '/company/my-opportunities'}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" /> Return to Applicants List
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Column 1: Summary */}
        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100 text-2xl font-bold text-gray-400">
            {initials || '?'}
          </div>
          <h2 className="mt-4 text-lg font-bold text-black">{applicant.name}</h2>
          <p className="text-sm text-gray-500">{applicant.college}</p>
          <p className="text-xs text-gray-400">
            {applicant.degree}
            {applicant.grad_year ? `, ${applicant.grad_year}` : ''}
          </p>

          <div className="mt-4 space-y-2">
            <a href={`mailto:${applicant.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
              <Mail className="h-4 w-4 text-gray-400" /> {applicant.email}
            </a>
            {applicant.phone && (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" /> {applicant.phone}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] text-gray-500 hover:bg-gray-50">
              <LinkIcon className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] text-gray-500 hover:bg-gray-50">
              <Code className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Column 2: Details */}
        <div className="space-y-5">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
            <h3 className="mb-2 text-sm font-semibold text-black">About</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {applicant.about || 'No about information provided.'}
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
            <h3 className="mb-2 text-sm font-semibold text-black">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {(applicant.skills || []).length === 0 ? (
                <p className="text-sm text-gray-400">No skills listed.</p>
              ) : (
                applicant.skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {s} <span className="text-gray-400">×</span>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-black">Resume Preview</h3>
              <button
                onClick={downloadResume}
                className="text-gray-400 hover:text-black"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
            <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100">
              {applicant.resume_url ? (
                <FileText className="h-10 w-10 text-gray-300" />
              ) : (
                <span className="text-xs text-gray-400">No resume uploaded</span>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Recruiter Actions */}
        <div className="space-y-5">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-black">Recruiter Actions</h3>

            <label className="mb-1.5 block text-xs font-medium text-gray-500">Application Status</label>
            <select
              value={status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={savingStatus}
              className="mb-4 h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm capitalize focus:border-black focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>

            <label className="mb-1.5 block text-xs font-medium text-gray-500">Internal Notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add private notes about this candidate..."
              className="mb-2 w-full resize-y rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none"
            />
            <button
              onClick={saveNotes}
              className="mb-4 w-full rounded-lg border border-[#E5E5E5] py-2 text-xs font-medium text-black hover:bg-gray-50"
            >
              Save Notes
            </button>

            <div className="space-y-2">
              <button
                onClick={() => setInterviewOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                <CalendarClock className="h-4 w-4" /> Schedule Interview
              </button>
              <button
                onClick={downloadResume}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5E5E5] py-2.5 text-sm font-medium text-black hover:bg-gray-50"
              >
                <Download className="h-4 w-4" /> Download Resume
              </button>
              <button
                onClick={contactApplicant}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5E5E5] py-2.5 text-sm font-medium text-black hover:bg-gray-50"
              >
                <ArrowUpRight className="h-4 w-4" /> Contact Applicant
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-[#F0F0F0] pt-4">
              <button
                onClick={() => setRejectOpen(true)}
                className="flex-1 rounded-lg py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Reject
              </button>
              <button
                onClick={shareProfile}
                className="flex-1 rounded-lg border border-[#E5E5E5] py-2 text-sm font-medium text-black hover:bg-gray-50"
              >
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      <Dialog open={interviewOpen} onOpenChange={setInterviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Date</label>
                <input
                  type="date"
                  value={interview.date}
                  onChange={(e) => setInterview({ ...interview, date: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-sm focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Time</label>
                <input
                  type="time"
                  value={interview.time}
                  onChange={(e) => setInterview({ ...interview, time: e.target.value })}
                  className="h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-sm focus:border-black focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Mode</label>
              <select
                value={interview.mode}
                onChange={(e) => setInterview({ ...interview, mode: e.target.value })}
                className="h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-sm focus:border-black focus:outline-none"
              >
                {['Video Call', 'Phone Call', 'On-site'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Notes</label>
              <textarea
                rows={3}
                value={interview.notes}
                onChange={(e) => setInterview({ ...interview, notes: e.target.value })}
                placeholder="Interview details, agenda, attendees..."
                className="w-full resize-y rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm placeholder:text-gray-400 focus:border-black focus:outline-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInterviewOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={scheduleInterview}
              disabled={!interview.date || !interview.time}
              className="bg-black text-white hover:bg-gray-800"
            >
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation */}
      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this applicant?</AlertDialogTitle>
            <AlertDialogDescription>
              {applicant.name}'s application status will be updated to "Rejected". You can change it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={rejectApplicant} className="bg-red-600 text-white hover:bg-red-700">
              Reject Applicant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Profile Modal */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Profile</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            A secure share link has been generated. Anyone with this link can view this candidate's profile.
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-[#F9F9F9] px-3 py-2">
            <input readOnly value={shareLink} className="flex-1 bg-transparent text-sm text-gray-600 focus:outline-none" />
            <button
              onClick={() => {
                navigator.clipboard?.writeText(shareLink);
                toast({ title: 'Link copied to clipboard' });
              }}
              className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
            >
              Copy
            </button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}