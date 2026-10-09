import * as React from "react"
import { AnimatePresence, motion, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

/*
 * cult-ui shift-card, restyled for ethansimon.me (flat, zero radius, ruled edges).
 * At rest it shows topContent and middleContent. On hover or keyboard focus the middle fades
 * out, topAnimateContent slides in, and bottomContent grows from its first row to full height.
 */
interface ShiftCardProps
  extends Omit<MotionProps, "onAnimationStart" | "onAnimationComplete"> {
  className?: string
  topContent?: React.ReactNode
  middleContent?: React.ReactNode
  topAnimateContent?: React.ReactNode
  bottomContent?: React.ReactNode
  /** Height of the bottom region before it opens. */
  collapsedHeight?: number
}

const ease = [0.22, 1, 0.36, 1] as const

const ShiftCard = React.forwardRef<HTMLDivElement, ShiftCardProps>(
  (
    {
      className,
      topContent,
      topAnimateContent,
      middleContent,
      bottomContent,
      collapsedHeight = 40,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)

    return (
      <motion.div
        ref={ref}
        data-open={open}
        className={cn(
          "group relative flex min-h-[410px] w-full flex-col overflow-hidden bg-[var(--color-bg)] p-4 text-sm",
          className
        )}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
        }}
        {...props}
      >
        <div className="relative flex w-full flex-col">
          {topContent}
          <AnimatePresence>{open ? topAnimateContent : null}</AnimatePresence>
        </div>

        <div className="relative mt-3 flex-1">
          <AnimatePresence initial={false}>
            {!open ? (
              <motion.div
                key="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {middleContent}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.div
          className="absolute inset-x-0 bottom-0 overflow-hidden bg-[var(--color-bg)] px-4"
          initial={false}
          animate={{ height: open ? "auto" : collapsedHeight }}
          transition={{ duration: 0.35, ease }}
        >
          {bottomContent}
        </motion.div>
      </motion.div>
    )
  }
)
ShiftCard.displayName = "ShiftCard"

export { ShiftCard }
export default ShiftCard
