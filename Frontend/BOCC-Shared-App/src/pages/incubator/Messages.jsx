import { useState } from 'react';
import {
  Search,
  Edit,
  Video,
  Phone,
  MoreVertical,
  Paperclip,
  Smile,
  Image as ImageIcon,
  Send,
  User,
  Calendar,
  FileText,
  Milestone,
  ExternalLink,
  ChevronLeft,
  TrendingUp,
  Download,
} from 'lucide-react';
import IncubatorShell from '@/components/incubator/IncubatorShell';
import ComingSoon from '@/components/ui/ComingSoon';

const CONVERSATIONS = [
  {
    id: 'acme',
    name: 'Acme Robotics',
    subtitle: 'Autonomous Last-Mile Delivery',
    preview: "We've just uploaded the Q3 deck...",
    time: '2m',
    avatar: 'AR',
  },
  {
    id: 'ecostream',
    name: 'EcoStream Solutions',
    subtitle: 'Waste Management Tech',
    preview: 'The mentor session was very helpful.',
    time: '1h',
    avatar: 'ES',
  },
  {
    id: 'cloudpath',
    name: 'CloudPath AI',
    subtitle: 'Enterprise Cloud Orchestration',
    preview: 'Thanks! See you tomorrow.',
    time: '4h',
    avatar: 'CP',
  },
  {
    id: 'batch2024',
    name: 'Batch 2024 General',
    subtitle: 'Cohort Discussion Group',
    preview: 'Marcus: New office hours posted.',
    time: '1d',
    avatar: 'B2',
  },
];

const SEEDED_MESSAGES_ACME = [
  {
    id: 1,
    sender: 'them',
    text: "Hi Sarah, we've completed the initial prototype for the autonomous delivery unit. I've uploaded the specs to the tracker but wanted to share the deck here first.",
    time: '10:42 AM',
  },
  {
    id: 2,
    sender: 'me',
    text: "That's fantastic news! I'll take a look at the specs this afternoon. Are you still on track for the pilot in September?",
    time: '10:45 AM',
    status: 'Read',
  },
  {
    id: 3,
    sender: 'them',
    text: "We've just uploaded the Q3 deck. Yes, the pilot is still set for Sep 12th. Just waiting on final sensor calibration.",
    time: '2m ago',
    attachment: {
      name: 'Q3_Acme_Robotics_Deck.pdf',
      size: '4.2 MB',
    },
  },
];

export default function ChatsPage() {
  const [activeConv, setActiveConv] = useState('acme');
  const [inputText, setInputText] = useState('');
  // Below `lg` the list and thread panels can't both fit — this app was
  // stacking them full-height instead of showing one at a time, which on
  // a phone meant scrolling past the entire conversation list before
  // reaching any part of the actual thread. `lg:`+ ignores this entirely
  // (both panels always show side-by-side there, see the className below).
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'thread'

  // Local active conversation message history state
  const [messagesMap, setMessagesMap] = useState({
    acme: SEEDED_MESSAGES_ACME,
    ecostream: [
      {
        id: 101,
        sender: 'them',
        text: 'The mentor session was very helpful.',
        time: '1h ago',
      },
    ],
    cloudpath: [
      {
        id: 201,
        sender: 'them',
        text: 'Thanks! See you tomorrow.',
        time: '4h ago',
      },
    ],
    batch2024: [
      {
        id: 301,
        sender: 'them',
        text: 'Marcus: New office hours posted.',
        time: '1d ago',
      },
    ],
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: inputText,
      time: 'Just now',
      status: 'Sent',
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeConv]: [...prev[activeConv], newMessage],
    }));

    setInputText('');
  };

  const activeDetails = CONVERSATIONS.find((c) => c.id === activeConv);
  const activeMessages = messagesMap[activeConv];

  return (
    <IncubatorShell>
      <div className="flex-1 flex flex-col lg:flex-row -m-6 md:-m-8 h-[calc(100vh-72px)] overflow-hidden">
        {/* 1. Left Panel: Conversation List — shown alone on mobile until a
            conversation is picked; both panels always show together at
            `lg:`+ regardless of mobileView. */}
        <div className={`${mobileView === 'list' ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 flex-col border-r border-border-subtle bg-surface-white flex-shrink-0 transition-colors duration-150 ease-linear`}>
          <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-canvas-bg/50">
            <h2 className="font-poppins font-bold text-headline-sm text-text-heading">
              Messages
            </h2>
            <ComingSoon
              label="New Message"
              position="bottom"
              inline
              className="p-1.5 rounded hover:bg-canvas-bg text-text-muted hover:text-text-heading transition-colors"
            >
              <Edit size={18} strokeWidth={2} />
            </ComingSoon>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border-subtle/50">
            {CONVERSATIONS.map((conv) => {
              const isSelected = activeConv === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConv(conv.id);
                    setMobileView('thread');
                  }}
                  className={`w-full p-4 text-left flex gap-3 transition-colors relative hover:bg-canvas-bg/30 ${
                    isSelected ? 'bg-canvas-bg/60 border-l-4 border-brand-black' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-xs select-none flex-shrink-0">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-poppins font-bold text-small text-text-heading truncate">
                        {conv.name}
                      </span>
                      <span className="font-inter text-xs text-text-muted">
                        {conv.time}
                      </span>
                    </div>
                    <p className="font-inter text-body-md text-text-muted truncate">
                      {conv.preview}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Center Panel: Active Chat Thread — shown alone on mobile once
            a conversation is picked; see the list panel above. */}
        <div className={`${mobileView === 'thread' ? 'flex' : 'hidden'} lg:flex flex-1 flex-col bg-surface-white border-r border-border-subtle overflow-hidden transition-colors duration-150 ease-linear`}>
          {/* Chat Header */}
          <div className="p-4 px-6 border-b border-border-subtle flex items-center justify-between bg-canvas-bg/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Back to the conversation list — mobile/tablet only, `lg:`+
                  always shows both panels so there's nothing to "back" to. */}
              <button
                type="button"
                onClick={() => setMobileView('list')}
                aria-label="Back to conversation list"
                className="lg:hidden -ml-2 p-2 rounded-full text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>
              <div className="w-10 h-10 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-sm select-none">
                {activeDetails.avatar}
              </div>
              <div>
                <h3 className="font-poppins font-bold text-small text-text-heading">
                  {activeDetails.name}
                </h3>
                <p className="font-inter text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-success inline-block"></span>
                  Active now
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ComingSoon
                label="Start Video Call"
                position="bottom"
                inline
                className="p-2 rounded-lg hover:bg-canvas-bg text-text-muted hover:text-text-heading transition-colors"
              >
                <Video size={18} strokeWidth={2} />
              </ComingSoon>
              <ComingSoon
                label="Start Voice Call"
                position="bottom"
                inline
                className="p-2 rounded-lg hover:bg-canvas-bg text-text-muted hover:text-text-heading transition-colors"
              >
                <Phone size={18} strokeWidth={2} />
              </ComingSoon>
              <div className="h-6 w-[1px] bg-border-subtle mx-1"></div>
              <ComingSoon
                label="Options"
                position="bottom"
                inline
                className="p-2 rounded-lg hover:bg-canvas-bg text-text-muted hover:text-text-heading transition-colors"
              >
                <MoreVertical size={18} strokeWidth={2} />
              </ComingSoon>
            </div>
          </div>

          {/* Messages History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-canvas-bg/10">
            <div className="flex justify-center select-none">
              <span className="px-3 py-1 bg-canvas-bg border border-border-subtle text-text-muted font-poppins font-semibold text-caption rounded-full">
                August 24, 2024
              </span>
            </div>

            {activeConv !== 'acme' && (
              <div className="p-3 bg-surface-white border border-border-subtle rounded-lg text-text-muted font-inter text-xs text-center select-none shadow-card">
                ⚠️ Seeded Demo Channel. Displaying preview line as a static message placeholder.
              </div>
            )}

            {activeMessages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[80%] ${isMe ? 'self-end ml-auto flex-row-reverse' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-[10px] select-none flex-shrink-0">
                    {isMe ? 'ME' : activeDetails.avatar}
                  </div>
                  <div className="flex flex-col">
                    <div
                      className={`p-4 rounded-xl shadow-card border ${
                        isMe
                          ? 'bg-action-bg text-action-text border-brand-black rounded-tr-none'
                          : 'bg-surface-white text-text-body border-border-subtle rounded-tl-none'
                      }`}
                    >
                      <p className="font-inter text-body-md whitespace-pre-line leading-relaxed">
                        {msg.text}
                      </p>
                    </div>

                    {msg.attachment && (
                      <ComingSoon label={`Download ${msg.attachment.name}`} position="top" inline={false}>
                        <div className="mt-3 p-3 bg-surface-white border border-border-subtle rounded-lg flex items-center gap-3 cursor-pointer hover:bg-canvas-bg transition-colors w-full shadow-card text-left">
                          <div className="w-10 h-10 bg-canvas-bg border border-border-subtle rounded flex items-center justify-center text-text-muted">
                            <FileText size={20} strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-poppins font-semibold text-small text-text-heading truncate">
                              {msg.attachment.name}
                            </p>
                            <p className="font-inter text-xs text-text-muted">
                              {msg.attachment.size}
                            </p>
                          </div>
                          <Download size={18} className="text-text-muted flex-shrink-0" />
                        </div>
                      </ComingSoon>
                    )}

                    <span className={`font-inter text-[10px] leading-[14px] text-text-muted mt-1 ${isMe ? 'text-right' : ''}`}>
                      {msg.time} {msg.status ? `• ${msg.status}` : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Composition Bar */}
          <div className="p-4 border-t border-border-subtle bg-surface-white flex-shrink-0">
            <form onSubmit={handleSendMessage} className="border border-border-subtle rounded-xl p-3 bg-canvas-bg/30 focus-within:ring-1 focus-within:ring-brand-black transition-all">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                className="w-full bg-transparent border-none focus:ring-0 font-inter text-body-md text-text-body resize-none h-10 max-h-32 p-0 focus:outline-none placeholder:text-text-muted"
                placeholder="Type a message..."
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle/50">
                <div className="flex items-center gap-1">
                  <ComingSoon
                    label="Attach File"
                    position="top"
                    inline
                    className="p-1.5 rounded-lg hover:bg-canvas-bg text-text-muted hover:text-text-heading transition-colors"
                  >
                    <Paperclip size={18} strokeWidth={2} />
                  </ComingSoon>
                  <ComingSoon
                    label="Add Emoji"
                    position="top"
                    inline
                    className="p-1.5 rounded-lg hover:bg-canvas-bg text-text-muted hover:text-text-heading transition-colors"
                  >
                    <Smile size={18} strokeWidth={2} />
                  </ComingSoon>
                  <ComingSoon
                    label="Insert Image"
                    position="top"
                    inline
                    className="p-1.5 rounded-lg hover:bg-canvas-bg text-text-muted hover:text-text-heading transition-colors"
                  >
                    <ImageIcon size={18} strokeWidth={2} />
                  </ComingSoon>
                </div>
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`px-4 py-2 rounded-lg flex items-center gap-1.5 font-poppins font-semibold text-xs transition-opacity ${
                    inputText.trim()
                      ? 'bg-action-bg text-action-text hover:opacity-90 active:scale-[0.98]'
                      : 'bg-canvas-bg text-text-muted cursor-not-allowed'
                  }`}
                >
                  <span>Send</span>
                  <Send size={12} strokeWidth={2} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 3. Right Panel: Contextual Contact Card */}
        <div className="hidden xl:flex w-80 border-l border-border-subtle bg-surface-white flex-col overflow-y-auto flex-shrink-0 transition-colors duration-150 ease-linear">
          {/* Org Profile Snapshot */}
          <div className="p-6 flex flex-col items-center text-center border-b border-border-subtle bg-canvas-bg/10">
            <div className="w-20 h-20 rounded-xl bg-canvas-bg border border-border-subtle flex items-center justify-center mb-3 font-poppins font-bold text-text-heading text-2xl select-none">
              {activeDetails.avatar}
            </div>
            <h3 className="font-poppins font-bold text-headline-sm text-text-heading">
              {activeDetails.name}
            </h3>
            <p className="font-inter text-body-md text-text-muted mt-0.5">
              {activeDetails.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              <span className="px-2.5 py-0.5 bg-canvas-bg border border-border-subtle rounded-full text-[10px] font-poppins font-semibold uppercase tracking-wider text-text-muted">
                Seed Stage
              </span>
              <span className="px-2.5 py-0.5 bg-canvas-bg border border-border-subtle rounded-full text-[10px] font-poppins font-semibold uppercase tracking-wider text-text-muted">
                Hardware
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Key Contacts */}
            <div className="space-y-3">
              <h4 className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-widest">
                Key Contacts
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-xs select-none">
                    JW
                  </div>
                  <div>
                    <p className="font-poppins font-semibold text-small text-text-heading">
                      James Wilson
                    </p>
                    <p className="font-inter text-xs text-text-muted">
                      CEO &amp; Founder
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-xs select-none">
                    AC
                  </div>
                  <div>
                    <p className="font-poppins font-semibold text-small text-text-heading">
                      Dr. Aris Chen
                    </p>
                    <p className="font-inter text-xs text-text-muted">
                      Lead Mentor
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Milestone */}
            <div className="p-4 bg-canvas-bg border border-border-subtle rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-poppins font-bold text-small text-text-heading">
                  Upcoming Milestone
                </h4>
                <Milestone size={18} className="text-text-muted" />
              </div>
              <p className="font-inter text-body-md text-text-body font-semibold">
                Pilot Launch Phase A
              </p>
              <div className="flex items-center justify-between text-xs text-text-muted font-inter">
                <span>Sept 12, 2024</span>
                <span className="px-1.5 py-0.5 bg-surface-white border border-border-subtle rounded text-[10px] font-poppins font-semibold uppercase">
                  In 18 days
                </span>
              </div>
              <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden">
                <div className="h-full bg-brand-black dark:bg-white" style={{ width: '65%' }}></div>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-2">
              <h4 className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-widest mb-3">
                Quick Actions
              </h4>
              
              <ComingSoon label="View Startup Profile" position="top" inline={false}>
                <div className="w-full flex items-center justify-between p-2.5 border border-border-subtle rounded-lg hover:bg-canvas-bg cursor-pointer transition-colors group text-left">
                  <span className="font-poppins font-semibold text-small text-text-heading group-hover:opacity-70 transition-opacity">
                    View Startup Profile
                  </span>
                  <ExternalLink size={16} className="text-text-muted group-hover:opacity-70 transition-opacity" />
                </div>
              </ComingSoon>

              <ComingSoon label="Access Documents" position="top" inline={false}>
                <div className="w-full flex items-center justify-between p-2.5 border border-border-subtle rounded-lg hover:bg-canvas-bg cursor-pointer transition-colors group text-left">
                  <span className="font-poppins font-semibold text-small text-text-heading group-hover:opacity-70 transition-opacity">
                    Access Documents
                  </span>
                  <ExternalLink size={16} className="text-text-muted group-hover:opacity-70 transition-opacity" />
                </div>
              </ComingSoon>

              <ComingSoon label="Schedule Meeting" position="top" inline={false}>
                <div className="w-full flex items-center justify-between p-2.5 border border-border-subtle rounded-lg hover:bg-canvas-bg cursor-pointer transition-colors group text-left">
                  <span className="font-poppins font-semibold text-small text-text-heading group-hover:opacity-70 transition-opacity">
                    Schedule Meeting
                  </span>
                  <ExternalLink size={16} className="text-text-muted group-hover:opacity-70 transition-opacity" />
                </div>
              </ComingSoon>

              <ComingSoon label="Open KPI Tracker" position="top" inline={false}>
                <div className="w-full flex items-center justify-between p-2.5 border border-border-subtle rounded-lg hover:bg-canvas-bg cursor-pointer transition-colors group text-left">
                  <span className="font-poppins font-semibold text-small text-text-heading group-hover:opacity-70 transition-opacity">
                    Open KPI Tracker
                  </span>
                  <ExternalLink size={16} className="text-text-muted group-hover:opacity-70 transition-opacity" />
                </div>
              </ComingSoon>
            </div>

            <div className="pt-4 border-t border-divider-line">
              <p className="font-inter text-xs text-text-muted italic">
                Last active: Today, 10:47 AM from Palo Alto, CA
              </p>
            </div>
          </div>
        </div>
      </div>
    </IncubatorShell>
  );
}
