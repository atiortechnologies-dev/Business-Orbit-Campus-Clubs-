const fs = require('fs');
const file = 'Frontend/src/pages/admin/Admin.jsx';
let content = fs.readFileSync(file, 'utf8');

// Insert imports
content = content.replace(
  "import { useDocumentTitle } from '@/hooks/useDocumentTitle';",
  "import { useDocumentTitle } from '@/hooks/useDocumentTitle';\nimport api from '@/api/axiosInstance';\nimport { AlertCircle } from 'lucide-react';"
);

// Add state variables and useEffect
const hookCode = `
  const [overview, setOverview] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(true);

  useEffect(() => {
    setErrorMsg("");
    setIsLoadingOverview(true);
    api.get("/admin/overview")
      .then((res) => {
        setOverview(res);
        if (res?.criticalActions) {
          const ICON_MAP = { UserPlus, FileText, AlertTriangle, RefreshCw };
          const mappedActions = res.criticalActions.map(ca => ({
            ...ca,
            icon: ICON_MAP[ca.iconName] || AlertTriangle
          }));
          setCriticalActions(mappedActions);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch overview", err);
        setErrorMsg(prev => prev || err?.response?.data?.message || err?.message || "Failed to fetch overview");
      })
      .finally(() => setIsLoadingOverview(false));

    setIsLoadingUpdates(true);
    api.get("/admin/updates")
      .then((res) => {
        if (res?.updates && res.updates.length > 0) {
          const mappedUpdates = res.updates.map((u) => ({
            icon: RefreshCw,
            text: u.message || u.text || "System Update",
            time: u.time || "Recently",
          }));
          setUpdates(mappedUpdates);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch updates", err);
        setErrorMsg(prev => prev || err?.response?.data?.message || err?.message || "Failed to fetch updates");
      })
      .finally(() => setIsLoadingUpdates(false));
  }, []);
`;

content = content.replace(
  "const [criticalActions, setCriticalActions] = useState(INITIAL_CRITICAL_ACTIONS);",
  "const [criticalActions, setCriticalActions] = useState(INITIAL_CRITICAL_ACTIONS);\n" + hookCode
);

// Replace dismiss action
const oldDismiss = "const dismissAction = (id) => setCriticalActions((prev) => prev.filter((a) => a.id !== id));";
const newDismiss = `
  const dismissAction = async (id) => {
    setErrorMsg("");
    try {
      await api.patch("/admin/actions", { actionId: id, status: "dismissed" });
      setCriticalActions((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Failed to dismiss action:", e);
      setErrorMsg(e?.response?.data?.message || e?.message || "Failed to dismiss action");
    }
  };
`;
content = content.replace(oldDismiss, newDismiss);

// Error banner
content = content.replace(
  "<AdminShell>",
  `<AdminShell>\n      {errorMsg && (\n        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">\n          <AlertCircle size={16} className="shrink-0" />\n          <span>{errorMsg}</span>\n        </div>\n      )}`
);

// Replace FUNNEL_VIEWS
content = content.replace(
  "const funnel = FUNNEL_VIEWS[funnelView];",
  `const activeFunnelViews = overview?.funnelViews || FUNNEL_VIEWS;
  const funnel = activeFunnelViews[funnelView] || activeFunnelViews['Daily'];`
);

// Replace USER_DISTRIBUTION map
content = content.replace(
  "USER_DISTRIBUTION.map(",
  "(overview?.userDistribution || USER_DISTRIBUTION).map("
);

// Replace ACTIVITY_STREAM map
content = content.replace(
  "ACTIVITY_STREAM.map(",
  "(updates.length > 0 ? updates : ACTIVITY_STREAM).map("
);

// Replace StatCard values with dynamic ones
content = content.replace(
  `value="12,482"`,
  `value={overview?.metrics?.totalUsers?.toLocaleString() || "12,482"}`
);
content = content.replace(
  `value="456"`,
  `value={overview?.metrics?.activeStartups?.toLocaleString() || "456"}`
);
content = content.replace(
  `value="24"`,
  `value={overview?.metrics?.pendingVerifications || "24"}`
);

fs.writeFileSync(file, content);
console.log('Admin patched');
