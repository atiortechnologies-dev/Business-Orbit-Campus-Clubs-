import { useMemo, useState, useEffect } from "react";
import { Search, Send, Paperclip, AlertCircle } from "lucide-react";
import api from "@/api/axiosInstance";
import MentorShell from "@/components/mentor/MentorShell";
import ComingSoon from "@/components/ui/ComingSoon";
import Badge from "@/components/ui/Badge";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const INITIAL_THREADS = [
  {
    id: 1,
    name: "Sarah Chen",
    preview: "I've updated the financial model as we discussed.",
    time: "2m ago",
    tag: "FinTech",
    role: "Founder, EcoFlow",
    status: "Active now",
    startupIdea:
      "AI-driven waste management systems for small-scale urban manufacturing hubs.",
    stage: "Pre-Seed",
    college: "MIT Sloan",
    cohort: "Spring 2024",
    messages: [
      {
        id: 1,
        from: "me",
        text: "Hi Sarah! I just finished reviewing your draft. The market size calculations look much more realistic now. Have you thought about the go-to-market strategy for the enterprise segment specifically?",
        time: "10:15 AM",
      },
      {
        id: 2,
        from: "them",
        text: "Thanks, Priya! I actually just uploaded an updated version of the model that includes a slide on the GTM strategy. I'm focusing on the direct sales approach first for the local markets.",
        time: "10:22 AM",
      },
      {
        id: 3,
        from: "me",
        text: "I've updated the financial model as we discussed. Let me know if the burn rate projections look okay to you now.",
        time: "10:23 AM",
      },
      {
        id: 4,
        from: "them",
        text: "Got it. Let me take a look at the slide. Are you free for a quick call later this week to walk through it?",
        time: "10:25 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Marcus Chen",
    preview: "Can we move the meeting to 3 PM instead?",
    time: "1h ago",
    tag: null,
    role: "Founder",
    status: "Offline",
    startupIdea: "",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Can we move the meeting to 3 PM instead?",
        time: "9:10 AM",
      },
    ],
  },
  {
    id: 3,
    name: "Aisha Gupta",
    preview: "Attached is the deck for the seed round...",
    time: "3h ago",
    tag: null,
    role: "Founder",
    status: "Offline",
    startupIdea: "",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Attached is the deck for the seed round.",
        time: "7:40 AM",
      },
    ],
  },
  {
    id: 4,
    name: "Julian Vasseur",
    preview: "Thanks for the feedback on the landing page.",
    time: "Yesterday",
    tag: null,
    role: "Founder",
    status: "Offline",
    startupIdea: "",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Thanks for the feedback on the landing page.",
        time: "Yesterday",
      },
    ],
  },
];

export default function MentorChatsPage() {
  useDocumentTitle("Chats — BOCC");
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState(INITIAL_THREADS[0].id);
  const [threadSearch, setThreadSearch] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const [filteredThreads, setFilteredThreads] = useState(INITIAL_THREADS);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await api.get("/conversations/search", {
          params: { q: threadSearch },
        });
        if (Array.isArray(response)) {
          setFilteredThreads(response.length ? response : threads);
        } else if (response.data && Array.isArray(response.data)) {
          setFilteredThreads(response.data.length ? response.data : threads);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };
    const timeoutId = setTimeout(fetchThreads, 300);
    return () => clearTimeout(timeoutId);
  }, [threadSearch, threads]);

  useEffect(() => {
    if (activeThreadId) {
      api
        .patch(`/read/${activeThreadId}`)
        .catch((err) => console.error("Failed to mark read:", err));
    }
  }, [activeThreadId]);

  const handleSend = async () => {
    if (messageInput.trim() === "") return;
    const msg = messageInput.trim();
    const tempId = Date.now(); // More robust than length + 1

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? {
              ...t,
              messages: [
                ...t.messages,
                { id: tempId, from: "me", text: msg, time: "Now" },
              ],
            }
          : t,
      ),
    );
    setMessageInput("");
    setErrorMsg("");

    try {
      await api.post(`/chat/conversations/${activeThreadId}/messages`, {
        text: msg,
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send message.",
      );
      // Rollback optimistic UI
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? { ...t, messages: t.messages.filter((m) => m.id !== tempId) }
            : t,
        ),
      );
      setMessageInput(msg); // Restore draft
    }
  };

  return (
    <MentorShell>
      <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card overflow-hidden h-[calc(100vh-220px)] min-h-[500px] flex">
        <div className="w-full sm:w-80 border-r border-border-subtle flex flex-col shrink-0">
          <div className="p-4 border-b border-border-subtle">
            <div className="relative">
              <Search
                size={16}
                strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={threadSearch}
                onChange={(e) => setThreadSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-canvas-bg border border-border-subtle rounded-md pl-9 pr-3 py-2 font-inter text-small focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
              />
            </div>
          </div>
          <p className="px-4 pt-3 pb-1 font-inter text-caption font-semibold uppercase tracking-wider text-text-muted">
            Active Threads
          </p>
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => setActiveThreadId(thread.id)}
                className={`w-full text-left px-4 py-3 border-b border-border-subtle transition-colors ${
                  thread.id === activeThreadId
                    ? "bg-canvas-bg"
                    : "hover:bg-canvas-bg/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-poppins font-semibold text-small text-text-heading truncate">
                    {thread.name}
                  </span>
                  <span className="font-inter text-caption text-text-muted shrink-0">
                    {thread.time}
                  </span>
                </div>
                <p className="font-inter text-caption text-text-muted truncate">
                  {thread.preview}
                </p>
                {thread.tag && (
                  <Badge variant="info" className="mt-1.5">
                    {thread.tag}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {activeThread && (
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle shrink-0" />
                <div>
                  <p className="font-poppins font-semibold text-small text-text-heading">
                    {activeThread.name}
                  </p>
                  <p className="font-inter text-caption text-text-muted flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${activeThread.status === "Active now" ? "bg-success" : "bg-border-subtle"}`}
                    />
                    {activeThread.status}
                  </p>
                </div>
              </div>
              <ComingSoon
                label="Schedule Meeting"
                position="bottom"
                inline
                className="hidden sm:inline-flex items-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-3 py-2 rounded-md"
              >
                Schedule Meeting
              </ComingSoon>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.from === "me" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md rounded-lg px-4 py-2.5 font-inter text-small ${
                      msg.from === "me"
                        ? "bg-action-bg text-action-text"
                        : "bg-canvas-bg text-text-body"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="font-inter text-caption text-text-muted mt-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {errorMsg && (
              <div className="px-6 py-2">
                <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 px-6 py-4 border-t border-border-subtle">
              <ComingSoon label="Attach file" position="top" inline>
                <span className="block p-2 text-text-muted">
                  <Paperclip size={18} strokeWidth={2} />
                </span>
              </ComingSoon>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-canvas-bg border border-border-subtle rounded-md px-3 py-2 font-inter text-small focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
              />
              <button
                type="button"
                onClick={handleSend}
                className="p-2.5 bg-action-bg text-action-text rounded-md hover:opacity-90 transition-all"
              >
                <Send size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {activeThread?.startupIdea && (
          <div className="hidden lg:flex w-72 border-l border-border-subtle flex-col p-5 shrink-0 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-canvas-bg border border-border-subtle mx-auto mb-3" />
            <p className="font-poppins font-semibold text-small text-text-heading text-center">
              {activeThread.name}
            </p>
            <p className="font-inter text-caption text-text-muted text-center mb-4">
              {activeThread.role}
            </p>

            <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
              Startup Idea
            </p>
            <p className="font-inter text-small text-text-body bg-canvas-bg border border-border-subtle rounded-md p-3 mb-4">
              {activeThread.startupIdea}
            </p>

            <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2">
              Details
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-inter text-caption text-text-muted">
                  Stage
                </span>
                <Badge variant="neutral">{activeThread.stage}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-inter text-caption text-text-muted">
                  College
                </span>
                <span className="font-inter text-caption text-text-heading">
                  {activeThread.college}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-inter text-caption text-text-muted">
                  Cohort
                </span>
                <span className="font-inter text-caption text-text-heading">
                  {activeThread.cohort}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <ComingSoon
                label="Pitch Deck"
                position="top"
                inline={false}
                className="flex items-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-3 py-2 rounded-md"
              >
                Pitch Deck
              </ComingSoon>
              <ComingSoon
                label="Financials"
                position="top"
                inline={false}
                className="flex items-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-3 py-2 rounded-md"
              >
                Financials
              </ComingSoon>
            </div>
          </div>
        )}
      </div>
    </MentorShell>
  );
}
