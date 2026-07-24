// Import static asset
import logo from "@/assets/bocc-logo.png";

export function Logo({ className = "h-9 w-9" }) {
  return <img src={logo} className={className} alt="BOCC" />;
}

export function LogoLockup({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <Logo className="h-9 w-9 shrink-0" />

      <div className="leading-tight">
        <div className="text-[15px] font-semibold tracking-tight text-foreground">
          BOCC{" "}
          <span className="text-muted-foreground font-medium">
            – Business Orbit Campus Clubs
          </span>
        </div>

        {!compact && (
          <div className="text-[11px] text-muted-foreground">
            Powered by Atior Technologies
          </div>
        )}
      </div>
    </div>
  );
}