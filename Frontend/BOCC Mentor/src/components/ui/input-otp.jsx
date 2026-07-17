import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @param {...import("clsx").ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const InputOTP = React.forwardRef(
  /** @type {React.ForwardRefRenderFunction<HTMLInputElement, React.ComponentPropsWithoutRef<typeof OTPInput>>} */
  (({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  ))
);

InputOTP.displayName = "InputOTP";


/**
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 * @param {React.ForwardedRef<HTMLDivElement>} ref
 */
const InputOTPGroup = React.forwardRef(
  /**
   * @param {React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  function InputOTPGroup({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn("flex items-center", className)} {...props} />
    );
  }
);

InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef(
  /**
   * @param {{ index: number; className?: string } & React.HTMLAttributes<HTMLDivElement>} props
   * @param {React.ForwardedRef<HTMLDivElement>} ref
   */
  function InputOTPSlot({ index, className, ...slotProps }, ref) {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center border-y border-r text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
          isActive && "z-10 ring-2 ring-ring ring-offset-background",
          className
        )}
        {...slotProps}
      >
        {char}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
          </div>
        )}
      </div>
    );
  }
);
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
