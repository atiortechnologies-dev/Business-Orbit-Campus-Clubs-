import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  AlertCircle,
  Clock,
  FileText,
  Paperclip,
  Send,
  BookOpen,
  Download,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ComingSoon from "@/components/ui/ComingSoon";
import PlaceholderGraphic from "@/components/ui/PlaceholderGraphic";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { supportApi } from "@/api/supportApi";

// Ticket viewed from the student's own DashboardShell — `mine` marks the
// student's own messages (right-aligned), not the agent's.
const INITIAL_MESSAGES = [
  {
    id: 1,
    author: "Alex Rivera (You)",
    time: "Oct 24, 09:12 AM",
    mine: true,
    text: "Hi Support Team, I'm trying to provision a new API key for our enterprise staging environment, but I keep receiving a 'Limit Exceeded' error even though we are well within our quota. Can you check if there's a restriction on our account?",
    attachment: "error_log.txt",
  },
  {
    id: 2,
    author: "Jordan Smith (Agent)",
    time: "Oct 24, 11:45 AM",
    mine: false,
    text: "Hello Alex, thank you for reaching out. I've looked into your account settings. It appears there was a legacy flag on the staging environment quota from your previous tier upgrade. I've manually refreshed the limits for your organization. Could you please try generating the key again and let me know if it goes through?",
  },
  {
    id: 3,
    author: "Alex Rivera (You)",
    time: "Oct 24, 02:20 PM",
    mine: true,
    text: "Thanks for the quick response, Jordan. I just tried again but I'm now getting a different error: '403 Forbidden'. Attached the new screenshot below.",
    image: true,
  },
];

const TIMELINE = [
  { label: "Ticket Created", date: "Oct 22, 10:00 AM" },
  { label: "Assigned to Engineering", date: "Oct 22, 11:30 AM" },
  { label: "Latest Response", date: "Oct 24, 02:20 PM", current: true },
];

const ARTICLES = [
  { title: "Managing Enterprise Quotas", time: "3 min read" },
  { title: "API Error Code Reference", time: "10 min read" },
  { title: "Rotating API Keys Safely", time: "5 min read" },
];

function initials(name) {
  return name
    .split(" (")[0]
    .split(" ")
    .map((n) => n[0])
    .join("");
}

export default function TicketDetailPage() {
  useDocumentTitle("Ticket Detail — BOCC");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [reply, setReply] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendReply = async () => {
    if (reply.trim() === "") return;
    setErrorMsg("");
    try {
      // Mocking requestId to 123 for now since route doesn't pass it yet
      await supportApi.updateAssistance("123", {
        reply: reply.trim(),
      });
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          author: "Alex Rivera (You)",
          time: "Now",
          mine: true,
          text: reply.trim(),
        },
      ]);
      setReply("");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to send reply.",
      );
    }
  };

  return (
    <DashboardShell pageId="ticket-detail">
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/support/tickets"
          className="hover:text-text-heading transition-colors"
        >
          Support
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Ticket Detail</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-xl p-8">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <span className="font-inter text-caption text-text-muted block mb-1">
                  TKT-8842-X
                </span>
                <h1 className="font-poppins font-semibold text-headline-lg text-text-heading mb-3">
                  Issue with API Key Provisioning for Enterprise Tier
                </h1>
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="bg-canvas-bg px-3 py-1 rounded-full font-inter text-caption">
                    API &amp; Integration
                  </span>
                  <div className="flex items-center gap-1 font-inter text-caption text-text-muted">
                    <AlertCircle size={16} strokeWidth={2} />
                    <span>High Priority</span>
                  </div>
                  <div className="flex items-center gap-1 font-inter text-caption text-text-muted">
                    <Clock size={16} strokeWidth={2} />
                    <span>Created 2 days ago</span>
                  </div>
                </div>
              </div>
              <span className="bg-brand-black text-white px-4 py-1.5 rounded-full font-inter font-semibold text-caption shrink-0">
                Open
              </span>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="font-poppins font-semibold text-body text-text-heading px-2">
              Conversation
            </h2>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-4 ${m.mine ? "flex-row-reverse" : ""}`}
              >
                <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-caption text-text-muted shrink-0">
                  {initials(m.author)}
                </div>
                <div
                  className={`flex-1 space-y-2 ${m.mine ? "text-right" : ""}`}
                >
                  <div
                    className={`flex items-center gap-3 ${m.mine ? "justify-end" : ""}`}
                  >
                    {m.mine ? (
                      <>
                        <span className="font-inter text-caption text-text-muted">
                          {m.time}
                        </span>
                        <span className="font-inter font-semibold text-caption text-text-heading">
                          {m.author}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-inter font-semibold text-caption text-text-heading">
                          {m.author}
                        </span>
                        <span className="font-inter text-caption text-text-muted">
                          {m.time}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-lg font-inter text-small text-left inline-block max-w-[90%] ${
                      m.mine
                        ? "bg-brand-black text-white rounded-tr-none"
                        : "bg-canvas-bg border border-border-subtle rounded-tl-none"
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.attachment && (
                      <div className="mt-3 flex gap-3">
                        <div className="flex items-center gap-2 p-2 border border-border-subtle rounded-lg bg-surface-white cursor-pointer hover:bg-canvas-bg transition-colors">
                          <FileText
                            size={16}
                            strokeWidth={2}
                            className="text-text-muted"
                          />
                          <span className="font-inter text-caption text-text-heading">
                            {m.attachment}
                          </span>
                        </div>
                      </div>
                    )}
                    {m.image && (
                      <PlaceholderGraphic
                        icon={ImageIcon}
                        label="Screenshot"
                        iconSize={22}
                        className="mt-3 w-48 h-32 rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="bg-canvas-bg border border-border-subtle rounded-xl p-6">
            <label
              htmlFor="reply"
              className="font-inter font-semibold text-caption text-text-heading mb-2 block"
            >
              Send a Reply
            </label>

            {errorMsg && (
              <div className="mb-4 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <textarea
              id="reply"
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your message here..."
              className="w-full p-4 bg-surface-white border border-border-subtle rounded-lg font-inter text-small focus:outline-none focus:border-brand-black resize-none mb-4"
            />
            <div className="flex justify-between items-center">
              <ComingSoon label="Attach Files" position="top" inline>
                <span className="flex items-center gap-2 px-4 py-2 border border-brand-black rounded-lg hover:bg-canvas-bg transition-colors font-inter font-semibold text-caption cursor-pointer">
                  <Paperclip size={16} strokeWidth={2} />
                  Attach Files
                </span>
              </ComingSoon>
              <button
                type="button"
                onClick={handleSendReply}
                className="bg-brand-black text-white px-8 py-2 rounded-lg font-inter font-semibold text-caption hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Send size={16} strokeWidth={2} />
                Send Reply
              </button>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-canvas-bg border border-border-subtle rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-inter font-semibold text-[11px] text-text-muted uppercase tracking-wider mb-4">
                Ticket Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-inter text-caption text-text-muted">
                    Status
                  </span>
                  <span className="font-inter font-semibold text-caption flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-brand-black animate-pulse" />
                    Awaiting Agent
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-inter text-caption text-text-muted">
                    Assigned Agent
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-surface-white border border-border-subtle flex items-center justify-center font-poppins font-bold text-[9px] text-text-muted">
                      JS
                    </div>
                    <span className="font-inter font-semibold text-caption text-text-heading">
                      Jordan Smith
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-inter text-caption text-text-muted">
                    Est. Resolution
                  </span>
                  <span className="font-inter font-semibold text-caption text-text-heading">
                    4 hours
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-divider-line">
              <h3 className="font-inter font-semibold text-[11px] text-text-muted uppercase tracking-wider mb-4">
                Activity Timeline
              </h3>
              <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border-subtle">
                {TIMELINE.map((item) => (
                  <div key={item.label} className="flex gap-4 relative">
                    <div
                      className={`w-4 h-4 rounded-full z-10 ${item.current ? "bg-brand-black border-4 border-canvas-bg" : "bg-surface-white border border-border-subtle"}`}
                    />
                    <div>
                      <p className="font-inter font-semibold text-caption text-text-heading">
                        {item.label}
                      </p>
                      <p className="font-inter text-[11px] text-text-muted">
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-xl p-6">
            <h3 className="font-inter font-semibold text-[11px] text-text-muted uppercase tracking-wider mb-4">
              Related Articles
            </h3>
            <ul className="space-y-4">
              {ARTICLES.map(({ title, time }) => (
                <ComingSoon key={title} label={title} position="left">
                  <li className="group cursor-pointer w-full">
                    <div className="flex items-start gap-3">
                      <BookOpen
                        size={18}
                        strokeWidth={2}
                        className="text-text-muted group-hover:text-text-heading transition-colors"
                      />
                      <div>
                        <p className="font-inter font-semibold text-caption text-text-heading group-hover:underline">
                          {title}
                        </p>
                        <p className="font-inter text-[11px] text-text-muted">
                          {time}
                        </p>
                      </div>
                    </div>
                  </li>
                </ComingSoon>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <ComingSoon label="Export Conversation" position="top">
              <span className="w-full py-3 px-4 border border-brand-black rounded-lg font-inter font-semibold text-caption hover:bg-canvas-bg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Download size={16} strokeWidth={2} />
                Export Conversation
              </span>
            </ComingSoon>
            <ComingSoon label="Close Ticket" position="top">
              <span className="w-full py-3 px-4 border border-border-subtle rounded-lg font-inter font-semibold text-caption text-text-muted hover:bg-canvas-bg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <XCircle size={16} strokeWidth={2} />
                Close Ticket
              </span>
            </ComingSoon>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
