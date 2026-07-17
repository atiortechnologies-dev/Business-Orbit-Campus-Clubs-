import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * @typedef {import("react").ComponentPropsWithoutRef<typeof LabelPrimitive.Root>} LabelProps
 */

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef(
  /**
   * @param {LabelProps} props
   * @param {import("react").Ref<import("react").ElementRef<typeof LabelPrimitive.Root>>} ref
   */
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn([labelVariants(), className])} {...props} />
  )
)

Label.displayName = LabelPrimitive.Root.displayName

export { Label }
