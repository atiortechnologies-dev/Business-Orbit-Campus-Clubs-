import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  User,
  Briefcase,
  MessageSquare,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  getUserVerificationDetail,
  submitVerificationDecision,
} from "@/api/admin/adminUsersVerificationApi";

export default function MentorVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  useDocumentTitle(`Mentor Verification — BOCC Admin`);

  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState(null);
  const [openModal, setOpenModal] = useState(null); // 'approve' | 'reject' | 'request' | null
  const [submitting, setSubmitting] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [requestText, setRequestText] = useState("");

  useEffect(() => {
    if (!userId) return;
    async function loadUser() {
      try {
        setLoading(true);
        const res = await getUserVerificationDetail(userId);
        const data = res?.data || res;
        setAppData(data);
        if (data?.user?.profile_remarks) {
          setRemarks(data.user.profile_remarks);
        }
      } catch (error) {
        console.error("Failed to load mentor details:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [userId]);

  const handleDecision = async (decisionType) => {
    try {
      setSubmitting(true);
      await submitVerificationDecision(userId, {
        decision: decisionType,
        remarks,
        requestText,
      });

      setOpenModal(null);
      // Redirect back to verification queue on completion
      navigate("/admin/verification", { replace: true });
    } catch (error) {
      console.error("Failed to process decision:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-text-muted" />
        </div>
      </AdminShell>
    );
  }

  const { user, profile } = appData || {};

  return (
    <AdminShell>
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link
          to="/admin/verification"
          className="hover:text-text-heading transition-colors"
        >
          Verification
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Mentor Details</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">
            Mentor Verification
          </h1>
          <p className="font-inter text-body text-text-body mt-1">
            Review professional credentials and experience for platform
            accreditation.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={user?.account_status === "active" ? "success" : "warning"}
          >
            {user?.account_status?.toUpperCase() || "PENDING"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-heading">
                Basic Information
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Full Name
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {user?.fullName}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Email Address
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {user?.email}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Phone Number
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {user?.phone}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase
                size={16}
                strokeWidth={2}
                className="text-text-heading"
              />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-heading">
                Mentor Professional Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Organization / Company
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {profile?.organization || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Designation
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {profile?.designation || "N/A"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-2">
                  Area of Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(profile?.expertise) &&
                  profile.expertise.length > 0 ? (
                    profile.expertise.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-canvas-bg border border-border-subtle rounded-md font-inter text-caption text-text-body"
                      >
                        {tag}
                      </span>
                    ))
                  ) : typeof profile?.expertise === "string" ? (
                    <span className="px-2.5 py-1 bg-canvas-bg border border-border-subtle rounded-md font-inter text-caption text-text-body">
                      {profile.expertise}
                    </span>
                  ) : (
                    <span className="font-inter text-small text-text-muted">
                      N/A
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Years of Experience
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {profile?.years_of_experience
                    ? `${profile.years_of_experience} Years`
                    : "N/A"}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare
                size={16}
                strokeWidth={2}
                className="text-text-heading"
              />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-heading">
                Admin Remarks
              </h3>
            </div>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter internal verification notes..."
              rows={5}
              className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
            />
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck
                size={16}
                strokeWidth={2}
                className="text-text-heading"
              />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-heading">
                Verification Actions
              </h3>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setOpenModal("approve")}
                className="w-full py-3 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Approve User
              </button>
              <button
                type="button"
                onClick={() => setOpenModal("request")}
                className="w-full py-3 border border-border-subtle rounded-md font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
              >
                Request More Information
              </button>
              <button
                type="button"
                onClick={() => setOpenModal("reject")}
                className="w-full py-3 border border-error text-error rounded-md font-poppins font-semibold text-small hover:bg-error/5 transition-colors"
              >
                Reject User
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Confirmation Modal - Approve */}
      <Modal
        isOpen={openModal === "approve"}
        onClose={() => setOpenModal(null)}
        title="Approve Mentor Access?"
      >
        <p className="font-inter text-small text-text-body mb-6">
          {user?.fullName} will be listed as a verified Mentor on the platform.
          This action is logged in the audit trail.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenModal(null)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={submitting}
            onClick={() => handleDecision("approve")}
          >
            Confirm Approval
          </Button>
        </div>
      </Modal>

      {/* Confirmation Modal - Reject */}
      <Modal
        isOpen={openModal === "reject"}
        onClose={() => setOpenModal(null)}
        title="Reject Mentor Application?"
      >
        <p className="font-inter text-small text-text-body mb-6">
          {user?.fullName} will be notified that their mentor application was
          not approved.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenModal(null)}
          >
            Cancel
          </Button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleDecision("reject")}
            className="px-4 py-2 bg-error text-white rounded-md font-poppins font-semibold text-small hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Confirm Rejection
          </button>
        </div>
      </Modal>

      {/* Confirmation Modal - Request Info */}
      <Modal
        isOpen={openModal === "request"}
        onClose={() => setOpenModal(null)}
        title="Request More Information"
      >
        <textarea
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          placeholder="e.g. Please provide a professional reference or portfolio link."
          rows={4}
          className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenModal(null)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!requestText.trim() || submitting}
            onClick={() => handleDecision("request")}
          >
            Send Request
          </Button>
        </div>
      </Modal>
    </AdminShell>
  );
}
