import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, AlertCircle } from "lucide-react";
import MentorShell from "@/components/mentor/MentorShell";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const INITIAL_REQUESTS = [
  {
    id: 1,
    name: "Jordan Rivera",
    school: "Stanford University",
    major: "Computer Science",
    startupName: "Lumina AI",
    startupStage: "Pre-Seed / Prototype",
    summary:
      "Seeking technical mentorship for our NLP-driven healthcare logistics platform. We have a functional MVP and are looking for guidance on scaling our data architecture and preparing for a Seed round in Q3.",
  },
  {
    id: 2,
    name: "Sarah Chen",
    school: "MIT",
    major: "Mechanical Engineering",
    startupName: "EcoValve",
    startupStage: "Seed / Early Revenue",
    summary:
      "We developed a smart irrigation controller that reduces water waste by 40%. Looking for a mentor with experience in hardware manufacturing and B2B distribution channels in North America.",
  },
  {
    id: 3,
    name: "Marcus Thorne",
    school: "Oxford University",
    major: "Business Admin",
    startupName: "ThriftChain",
    startupStage: "Ideation",
    summary:
      "I am building a blockchain-based provenance system for the second-hand luxury market. I need advice on market entry strategy and navigating IP regulations within the fintech and retail space.",
  },
];

export default function MentorRequestsPage() {
  useDocumentTitle("Mentorship Requests — BOCC");
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [newestFirst, setNewestFirst] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAccept = async (id) => {
    try {
      setErrorMsg("");
      await api.patch(`/mentor/requests/${id}/accept`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to accept request.",
      );
    }
  };
  const handleDecline = async (id) => {
    try {
      setErrorMsg("");
      await api.patch(`/mentor/requests/${id}/decline`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to decline request.",
      );
    }
  };
  const sortedRequests = newestFirst ? requests : [...requests].reverse();

  return (
    <MentorShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-bold text-section text-text-heading mb-1">
            Mentorship Requests
          </h1>
          <p className="font-inter text-body text-text-muted">
            Manage incoming connections and potential startup collaborations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ComingSoon
            label="Filter"
            position="top"
            inline
            className="inline-flex items-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2 rounded-md"
          >
            <SlidersHorizontal size={16} strokeWidth={2} />
            Filter
          </ComingSoon>
          <button
            type="button"
            onClick={() => setNewestFirst((prev) => !prev)}
            className="inline-flex items-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2 rounded-md hover:bg-canvas-bg transition-colors"
          >
            <ArrowUpDown size={16} strokeWidth={2} />
            {newestFirst ? "Newest First" : "Oldest First"}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {sortedRequests.length === 0 ? (
        <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-10 text-center">
          <p className="font-inter text-small text-text-muted">
            No pending mentorship requests right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRequests.map((req) => (
            <div
              key={req.id}
              className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 flex flex-col"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-canvas-bg border border-border-subtle shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-poppins font-semibold text-small text-text-heading truncate">
                    {req.name}
                  </p>
                  <p className="font-inter text-caption text-text-muted truncate">
                    {req.school} &bull; {req.major}
                  </p>
                </div>
                <span className="font-inter text-caption font-semibold uppercase tracking-wide text-warning bg-warning/15 px-2 py-1 rounded-full shrink-0">
                  Pending
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border-subtle">
                <div>
                  <p className="font-inter text-caption uppercase tracking-wider text-text-muted">
                    Startup Name
                  </p>
                  <p className="font-poppins font-semibold text-small text-text-heading">
                    {req.startupName}
                  </p>
                </div>
                <div>
                  <p className="font-inter text-caption uppercase tracking-wider text-text-muted">
                    Startup Stage
                  </p>
                  <p className="font-poppins font-semibold text-small text-text-heading">
                    {req.startupStage}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex-1">
                <p className="font-inter text-caption uppercase tracking-wider text-text-muted mb-1">
                  Request Summary
                </p>
                <p className="font-inter text-small text-text-body leading-relaxed">
                  {req.summary}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <ComingSoon
                  label="View Profile"
                  position="top"
                  inline
                  className="flex-1 flex items-center justify-center border border-border-subtle text-text-heading font-inter font-medium text-small px-3 py-2 rounded-md"
                >
                  View Profile
                </ComingSoon>
                <button
                  type="button"
                  onClick={() => handleDecline(req.id)}
                  className="flex-1 border border-border-subtle text-text-heading font-inter font-medium text-small px-3 py-2 rounded-md hover:bg-canvas-bg transition-colors"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => handleAccept(req.id)}
                  className="flex-1 bg-action-bg text-action-text font-poppins font-semibold text-small px-3 py-2 rounded-md hover:opacity-90 transition-all"
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MentorShell>
  );
}
