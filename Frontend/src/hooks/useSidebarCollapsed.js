import { useEffect, useState } from "react";

const STORAGE_KEY = "sidebarCollapsed";

// Shared across all portal shells so collapsing the sidebar is
// remembered everywhere, not just on the page you were on.
export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem(STORAGE_KEY) === "true",
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  return [collapsed, () => setCollapsed((c) => !c)];
}
