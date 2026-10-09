import { useRef } from 'react'
import { useInView } from 'motion/react'
import { RollingNumber } from '@/components/ui/rolling-number'

/** A number that rolls up from zero the first time it scrolls into view. */
export function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true, margin: '-10% 0px' })
  return (
    <span ref={ref}>
      <RollingNumber
        value={seen ? to : 0}
        precision={decimals}
        format={(n) => n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      />
    </span>
  )
}
