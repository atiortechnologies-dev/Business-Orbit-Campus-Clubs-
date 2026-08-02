import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  User,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserVerificationDetail,
  submitVerificationDecision,
} from "@/api/admin/adminVerificationApi";
export default function InvestorVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  useDocumentTitle(`Investor Verification — BOCC Admin`);

  const [openModal, setOpenModal] = useState(null); // 'approve' | 'reject' | 'request' | null
  const [remarks, setRemarks] = useState("");
  const [requestText, setRequestText] = useState("");

  const queryClient = useQueryClient();

  const { data: appData, isLoading: loading, isError } = useQuery({
    queryKey: ["adminVerificationDetail", userId],
    queryFn: async () => {
      const res = await getUserVerificationDetail(userId);
      return res?.data || res;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (appData?.user?.profile_remarks) {
      setRemarks(appData.user.profile_remarks);
    }
  }, [appData]);

  const decisionMutation = useMutation({
    mutationFn: (decisionData) => submitVerificationDecision(userId, decisionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminVerificationQueue"] });
      setOpenModal(null);
      navigate("/admin/verification", { replace: true });
    },
    onError: (error) => {
      console.error("Failed to process decision:", error);
    },
  });

  const handleDecision = (decisionType) => {
    decisionMutation.mutate({
      decision: decisionType,
      remarks,
      requestText,
    });
  };

  const submitting = decisionMutation.isPending;

  if (loading) {
    return (
      <AdminShell>
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-text-muted" />
        </div>
      </AdminShell>
    );
  }

  if (isError) {
    return (
      <AdminShell>
        <div className="flex justify-center py-20 text-error font-inter font-medium text-small">
          Failed to load investor details. Please try again later.
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
        <span className="text-text-heading font-semibold">
          Investor Profile
        </span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">
            Investor Verification
          </h1>
          <p className="font-inter text-body text-text-body mt-1">
            Review investment credentials and focus areas for platform
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
              <TrendingUp
                size={16}
                strokeWidth={2}
                className="text-text-heading"
              />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-heading">
                Investor Information
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-canvas-bg border border-border-subtle rounded-md p-4">
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Organization / Fund
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {profile?.organization || "N/A"}
                </p>
              </div>
              <div className="bg-canvas-bg border border-border-subtle rounded-md p-4">
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Investment Stage
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {profile?.investment_stage || "N/A"}
                </p>
              </div>
              <div className="bg-canvas-bg border border-border-subtle rounded-md p-4">
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Industry Focus
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {profile?.investment_focus || "N/A"}
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
              placeholder="Type internal notes here..."
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
                Approve Investor
              </button>
              <button
                type="button"
                onClick={() => setOpenModal("reject")}
                className="w-full py-3 border border-error text-error rounded-md font-poppins font-semibold text-small hover:bg-error/5 transition-colors"
              >
                Reject Application
              </button>
              <button
                type="button"
                onClick={() => setOpenModal("request")}
                className="w-full py-3 border border-border-subtle rounded-md font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
              >
                Request Information
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Confirmation Modal - Approve */}
      <Modal
        isOpen={openModal === "approve"}
        onClose={() => setOpenModal(null)}
        title="Approve Investor Access?"
      >
        <p className="font-inter text-small text-text-body mb-6">
          {user?.fullName} will be listed as a verified Investor on the
          platform. This action is logged in the audit trail.
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
        title="Reject Investor Application?"
      >
        <p className="font-inter text-small text-text-body mb-6">
          {user?.fullName} will be notified that their investor application was
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

      {/* Confirmation Modal - Request Information */}
      <Modal
        isOpen={openModal === "request"}
        onClose={() => setOpenModal(null)}
        title="Request Information"
      >
        <textarea
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          placeholder="e.g. Please share your fund's accreditation documents."
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
