import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * @typedef {import("react").ComponentPropsWithoutRef<"div">} InputOTPGroupProps
 * @typedef {import("react").ComponentPropsWithoutRef<"div"> & { index: number }} InputOTPSlotProps
 */

const InputOTPGroup = React.forwardRef(
  /**
   * @param {InputOTPGroupProps} props
   * @param {import("react").Ref<HTMLDivElement>} ref
   */
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(["flex items-center", className])} {...props} />
  )
)
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef(
  /**
   * @param {InputOTPSlotProps} props
   * @param {import("react").Ref<HTMLDivElement>} ref
   */
  ({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext)
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn([
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className,
      ])}
      {...props}>
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

/**
 * @typedef {React.ComponentPropsWithoutRef<typeof OTPInput> & {
 *   containerClassName?: string
 * }} InputOTPProps
 */

/** @type {import("react").ForwardRefExoticComponent<import("react").PropsWithoutRef<InputOTPProps> & import("react").RefAttributes<import("react").ElementRef<typeof OTPInput>>>} */
const InputOTP = React.forwardRef(
  /**
   * @param {InputOTPProps} props
   * @param {import("react").Ref<import("react").ElementRef<typeof OTPInput>>} ref
   */
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn(["flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName])}
      className={cn(["disabled:cursor-not-allowed", className])}
      {...props}
    />
  )
);

InputOTP.displayName = "InputOTP"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
