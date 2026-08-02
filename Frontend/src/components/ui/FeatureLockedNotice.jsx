import { Lock } from "lucide-react";

// Full-page "not available yet" message rendered *inside* a shell's
// content area — sidebar/header/footer stay intact, unlike a route-level
// redirect. Used both for features that are simply unbuilt (Freelancing)
// and features gated behind a milestone (Mentor/Investor Network before
// Ideation is approved) — the icon/heading/message shape is identical,
// only the copy differs.
export default function FeatureLockedNotice({
  icon: Icon = Lock,
  heading,
  message,
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="w-14 h-14 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center mb-5">
        <Icon size={24} strokeWidth={1.75} className="text-text-heading" />
      </div>
      <h1 className="font-poppins font-semibold text-card text-text-heading mb-2">
        {heading}
      </h1>
      <p className="font-inter text-body text-text-muted max-w-md">
        {message}
      </p>
    </div>
  );
}
