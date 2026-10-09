import { type ReactNode, useMemo, useState } from "react"
import { AnimatePresence, motion, MotionConfig } from "motion/react"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"

/*
 * cult-ui direction-aware-tabs, restyled for ethansimon.me: a ruled tab strip with an accent
 * underline that slides between tabs, and a panel that slides in from the side you moved toward.
 */
type Tab = {
  id: number
  label: string
  content: ReactNode
}

interface DirectionAwareTabsProps {
  tabs: Tab[]
  className?: string
  /** Label for the tab list, read by screen readers. */
  label?: string
  onChange?: () => void
}

function DirectionAwareTabs({ tabs, className, label = "Sections", onChange }: DirectionAwareTabsProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState(0)
  const [switched, setSwitched] = useState(false)
  const [ref, bounds] = useMeasure()
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), [])

  const content = tabs.find((tab) => tab.id === activeTab)?.content ?? null

  const select = (id: number) => {
    if (id === activeTab) return
    setSwitched(true)
    setDirection(id > activeTab ? 1 : -1)
    setActiveTab(id)
    onChange?.()
  }

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null
    if (next === null || next < 0 || next >= tabs.length) return
    e.preventDefault()
    select(tabs[next].id)
    document.getElementById(`${uid}-tab-${tabs[next].id}`)?.focus()
  }

  const variants = {
    initial: (d: number) => ({ x: 120 * d, opacity: 0 }),
    active: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: -120 * d, opacity: 0 }),
  }

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div
        role="tablist"
        aria-label={label}
        className="flex flex-wrap gap-x-6 border-b-2 border-[var(--color-divider)]"
      >
        {tabs.map((tab, i) => {
          const on = activeTab === tab.id
          return (
            <button
              key={tab.id}
              id={`${uid}-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`${uid}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "relative min-h-[44px] cursor-pointer border-0 bg-transparent px-0 py-2 text-[14px] font-semibold uppercase tracking-[0.1em] transition-colors",
                on ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              )}
              style={{ WebkitTapHighlightColor: "transparent", fontFamily: "var(--font-heading)" }}
            >
              {on ? (
                <motion.span
                  layoutId={`${uid}-underline`}
                  className="absolute inset-x-0 -bottom-[2px] h-[2px] bg-[var(--color-accent)]"
                  transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                />
              ) : null}
              {tab.label}
            </button>
          )
        })}
      </div>
      <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.1 }}>
        <motion.div
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${activeTab}`}
          className="relative w-full overflow-x-clip"
          initial={false}
          animate={{ height: switched ? bounds.height : "auto" }}
        >
          <div ref={ref} className="pt-6">
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={activeTab}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  )
}
export { DirectionAwareTabs }
