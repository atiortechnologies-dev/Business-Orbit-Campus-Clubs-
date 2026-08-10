// import { useEffect, useState } from "react";
// import { Cookie } from "lucide-react";
// import Button from "@/components/ui/Button";

// const CONSENT_KEY = "bocc_cookie_consent";

// // TODO(backend): if a consent-logging endpoint is ever added, POST the
// // choice here alongside the localStorage write below — there's nowhere
// // real to send it today, so localStorage is the honest implementation,
// // not a stub standing in for a real one.
// export default function CookieBanner() {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem(CONSENT_KEY);
//       if (!stored) setVisible(true);
//     } catch {
//       // localStorage unavailable (private mode, etc.) — just skip the
//       // banner rather than risk it reappearing every render.
//     }
//   }, []);

//   function handleChoice(choice) {
//     try {
//       localStorage.setItem(CONSENT_KEY, choice);
//     } catch {
//       // Nothing to persist, but still dismiss for this session.
//     }
//     setVisible(false);
//   }

//   if (!visible) return null;

//   return (
//     <div
//       role="dialog"
//       aria-label="Cookie consent"
//       className="fixed bottom-4 inset-x-4 z-[70] sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 animate-slide-up-in"
//     >
//       <div className="bg-surface-white border border-border-subtle rounded-xl shadow-overlay p-5 flex flex-col gap-4">
//         <div className="flex items-start gap-3">
//           <span className="w-8 h-8 rounded-full bg-accent-neon/20 text-text-heading flex items-center justify-center shrink-0">
//             <Cookie size={16} strokeWidth={2} />
//           </span>
//           <p className="font-inter text-small text-text-body">
//             We use cookies to keep you signed in and improve your experience on
//             BOCC. Accept all, or decline non-essential cookies.
//           </p>
//         </div>
//         <div className="flex items-center justify-end gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleChoice("declined")}
//           >
//             Decline
//           </Button>
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={() => handleChoice("accepted")}
//           >
//             Accept All
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
