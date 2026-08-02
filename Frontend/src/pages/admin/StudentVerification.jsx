import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  User,
  GraduationCap,
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
export default function StudentVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  useDocumentTitle(`Student Verification — BOCC Admin`);

  const [openModal, setOpenModal] = useState(null);
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
          Failed to load student details. Please try again later.
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
        <span className="text-text-heading font-semibold">Student Details</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">
            Student Verification
          </h1>
          <p className="font-inter text-body text-text-body mt-1">
            Review campus affiliation and profile details for platform
            accreditation.
          </p>
        </div>
        <Badge
          variant={user?.account_status === "active" ? "success" : "warning"}
        >
          {user?.account_status?.toUpperCase() || "PENDING"}
        </Badge>
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
              <GraduationCap
                size={16}
                strokeWidth={2}
                className="text-text-heading"
              />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-heading">
                Student Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  College
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {profile?.college || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Degree
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {profile?.degree || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Graduation Year
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {profile?.graduation_year || "N/A"}
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
        title="Approve Student Access?"
      >
        <p className="font-inter text-small text-text-body mb-6">
          {user?.fullName} will be listed as a verified Student on the platform.
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
        title="Reject Student Registration?"
      >
        <p className="font-inter text-small text-text-body mb-6">
          {user?.fullName} will be notified that their registration was not
          approved.
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

      {/* Confirmation Modal - Request More Info */}
      <Modal
        isOpen={openModal === "request"}
        onClose={() => setOpenModal(null)}
        title="Request More Information"
      >
        <textarea
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          placeholder="e.g. Please provide a valid student ID or enrollment proof."
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
