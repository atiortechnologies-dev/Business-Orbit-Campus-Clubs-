import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Download,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowRight,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { downloadCsv } from "@/utils/csv";
import api from "@/api/axiosInstance";



const PRIORITY_VARIANT = { High: "error", Medium: "warning", Low: "neutral" };
const STATUS_VARIANT = { Pending: "info", "Under Review": "warning" };

export default function ReviewQueuePage() {
  useDocumentTitle("Stage Approval Queue — BOCC Admin");
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchQueue = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await api.get("/admin/reviews");
        if (res.success) {
          setSubmissions(res.data);
        } else {
          setErrorMsg(res.message || "Failed to fetch review queue");
        }
      } catch (err) {
        console.error("Failed to fetch review queue", err);
        setErrorMsg(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  const columns = [
    {
      key: "name",
      label: "Startup",
      width: "1.6fr",
      mobileLabel: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-xs select-none shrink-0">
            {row.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-poppins font-semibold text-small text-text-heading truncate">
              {row.name}
            </p>
            <p className="font-inter text-caption text-text-muted truncate">
              {row.founder}
            </p>
          </div>
        </div>
      ),
    },
    { key: "chapter", label: "Chapter", width: "1.2fr" },
    {
      key: "stage",
      label: "Stage",
      width: "1fr",
      render: (row) => <Badge variant="brand">{row.stage}</Badge>,
    },
    { key: "date", label: "Submitted", width: "1fr" },
    { key: "reviewer", label: "Reviewer", width: "1.1fr" },
    {
      key: "priority",
      label: "Priority",
      width: "0.8fr",
      render: (row) => (
        <Badge variant={PRIORITY_VARIANT[row.priority]}>{row.priority}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "1fr",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      width: "0.8fr",
      mobileLabel: false,
      render: () => (
        <span className="flex items-center gap-1 font-inter font-semibold text-small text-text-heading">
          View <ArrowRight size={14} strokeWidth={2} />
        </span>
      ),
    },
  ];

  return (
    <AdminShell>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">
            Stage Approval Queue
          </h1>
          <p className="font-inter text-body text-text-body mt-1">
            Review startup submissions across all stages of the BOCC Startup
            Journey.
          </p>
        </div>
        <div className="flex gap-2">
          <ComingSoon label="Bulk Action" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small">
              <Zap size={14} strokeWidth={2} /> Bulk Action
            </span>
          </ComingSoon>
          <button
            type="button"
            onClick={() =>
              downloadCsv(
                "review-queue",
                [
                  { key: "name", label: "Startup" },
                  { key: "founder", label: "Founder" },
                  { key: "chapter", label: "Chapter" },
                  { key: "stage", label: "Stage" },
                  { key: "date", label: "Submitted" },
                  { key: "reviewer", label: "Reviewer" },
                  { key: "priority", label: "Priority" },
                  { key: "status", label: "Status" },
                ],
                submissions,
              )
            }
            className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small hover:bg-canvas-bg transition-colors"
          >
            <Download size={14} strokeWidth={2} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Pending Reviews"
          value="42"
          icon={<Clock size={18} strokeWidth={2} />}
          subtext="+12% from last week"
          trendDirection="up"
        />
        <StatCard
          label="Approved Today"
          value="18"
          icon={<CheckCircle size={18} strokeWidth={2} />}
          subtext="Daily target: 25"
        />
        <StatCard
          label="Rejected Today"
          value="04"
          icon={<XCircle size={18} strokeWidth={2} />}
          subtext="Within threshold"
        />
        <StatCard
          label="Meetings Pending"
          value="09"
          icon={<Calendar size={18} strokeWidth={2} />}
          subtext="Next: 14:00 PM"
        />
      </div>

      {errorMsg ? (
        <div className="text-error bg-error/10 p-4 rounded-md mb-4 border border-error/20">
          {errorMsg}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={submissions}
          onRowClick={(row) => navigate(`/admin/reviews/detail?id=${row.id}`)}
          emptyMessage={loading ? "Loading submissions..." : "No submissions in the queue."}
        />
      )}
      <div className="flex justify-between items-center mt-4">
        <span className="font-inter text-small text-text-muted">
          Showing 1-{submissions.length} of {submissions.length} submissions
        </span>
      </div>
    </AdminShell>
  );
}
