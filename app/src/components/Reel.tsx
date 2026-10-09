import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { CountUp } from '@/components/CountUp'
import { ShiftCard } from '@/components/ui/shift-card'
import {
  CutoutCard,
  CutoutCardMedia,
  CutoutCardPin,
  CutoutCorner,
  cutoutCardSurfaceClassName,
} from '@/components/ui/cutout-card'
import reelHtml from '@/site/parts/reel.html?raw'

type Item = {
  id: string
  href: string
  title: string
  desc: string
  disc: string
  built: string
  result: string
  fig: string
  meta: string
}
type SheetSet = { title: string; rows: boolean; items: Item[] }

// The headline number on each card, as stated in that project's own result line.
const STAT: Record<string, { to: number; decimals?: number; prefix?: string; suffix?: string; unit: string }> = {
  'tylok-fatigue-machine': { to: 2000, prefix: 'over ', unit: 'lb load' },
  'mission-model': { to: 2793, unit: 'combinations' },
  'fly-brain-drone': { to: 12, suffix: ' of 12', unit: 'episodes reached' },
  'log-dashboard': { to: 65, suffix: '/100', unit: 'sample flight' },
  'wing-optimizer': { to: 8.64, decimals: 2, prefix: 'AR ', unit: 'balanced tailsitter' },
  'liquid-rocket': { to: 9, unit: 'sensor channels' },
  'naca-solidworks': { to: 80, unit: 'points per surface' },
  'x8-tailsitter': { to: 8, unit: 'motors, one wing' },
}

// The reel markup in index.html is the single source for titles, text and figure names.
function parse(): SheetSet[] {
  const doc = new DOMParser().parseFromString(reelHtml, 'text/html')
  return [...doc.querySelectorAll('.sheetset')].map((set) => {
    const rows = !!set.querySelector('.sheet-rows')
    const items = [...set.querySelectorAll<HTMLAnchorElement>('a.frame, a.row')].map((a) => {
      const href = a.getAttribute('href') ?? '#'
      const v = a.querySelectorAll('.frame-tb .tb-value')
      return {
        id: href.startsWith('#') ? href.slice(1) : 'hexacopter-drone',
        href,
        title: a.querySelector('h4')?.textContent ?? '',
        desc: a.querySelector('p')?.textContent?.trim() ?? '',
        disc: v[0]?.textContent ?? '',
        built: v[1]?.textContent ?? '',
        result: a.querySelector('.tb-result')?.innerHTML ?? '',
        fig: a.querySelector<HTMLElement>('.frame-fig')?.dataset.fig ?? '',
        meta: a.querySelector('.row-meta')?.textContent?.replace('→', '').trim() ?? '',
      }
    })
    return { title: set.querySelector('h3')?.textContent ?? '', rows, items }
  })
}
const sets = parse()

function Stat({ id }: { id: string }) {
  const s = STAT[id]
  if (!s) return null
  return (
    <div className="flex flex-col items-start leading-none">
      <b className="text-[22px] font-extrabold tracking-[-0.02em] text-[var(--color-accent-700)] tabular-nums">
        {s.prefix ? <span className="text-[13px] font-semibold">{s.prefix}</span> : null}
        <CountUp to={s.to} decimals={s.decimals} />
        {s.suffix ? <span className="text-[13px] font-semibold">{s.suffix}</span> : null}
      </b>
      <span className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{s.unit}</span>
    </div>
  )
}

function Card({ item }: { item: Item }) {
  const titleId = `rc-${item.id}`
  return (
    <ShiftCard
      topContent={
        <>
          <h4 id={titleId} className="rc-title">
            <a className="rc-link" href={item.href} aria-describedby={`${titleId}-d`}>{item.title}</a>
          </h4>
          <Badge id={`${titleId}-d`}>{item.disc}</Badge>
        </>
      }
      topAnimateContent={
        <motion.span
          aria-hidden="true"
          className="absolute right-0 top-0 text-[18px] font-extrabold text-[var(--color-accent-700)]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
        >
          <ArrowRight className="size-5" />
        </motion.span>
      }
      middleContent={
        <CutoutCard className={`${cutoutCardSurfaceClassName} rc-media`} trackPointerHover={false}>
          <CutoutCardMedia className="h-[250px] w-full">
            <div className="rc-fig" data-fig={item.fig} />
          </CutoutCardMedia>
          <CutoutCardPin className="right-0 top-0 bg-[var(--color-bg)] py-2 pl-3 pr-3">
            <CutoutCorner size={12} className="absolute right-full top-0 -rotate-90 text-[var(--color-bg)]" />
            <CutoutCorner size={12} className="absolute right-0 top-full -rotate-90 text-[var(--color-bg)]" />
            <Stat id={item.id} />
          </CutoutCardPin>
        </CutoutCard>
      }
      bottomContent={
        <div className="pb-4">
          <div className="rc-view" aria-hidden="true">View project <ArrowRight className="size-4" /></div>
          <p className="rc-desc">{item.desc}</p>
          <div className="frame-tb">
            <div><span className="tb-label">Discipline</span><span className="tb-value">{item.disc}</span></div>
            <div><span className="tb-label">Built with</span><span className="tb-value">{item.built}</span></div>
            <div className="tb-wide">
              <span className="tb-label">Result</span>
              <span className="tb-result" dangerouslySetInnerHTML={{ __html: item.result }} />
            </div>
          </div>
        </div>
      }
    />
  )
}

export function Reel() {
  return (
    <section id="reel" aria-labelledby="projects-title">
      <div className="sheet-head">
        <h2 id="projects-title">Projects</h2>
        <p>Thirteen projects. Open one for the write-up, the math, and the figures.</p>
      </div>
      {sets.map((set) => (
        <div className="sheetset" key={set.title}>
          <div className="sheetset-head"><h3>{set.title}</h3></div>
          {set.rows ? (
            <div className="sheet-rows">
              {set.items.map((it) => (
                <a href={it.href} className="row" key={it.id} aria-labelledby={`t-${it.id}`}>
                  <h4 id={`t-${it.id}`}>{it.title}</h4>
                  <p>{it.desc}</p>
                  <span className="row-meta">{it.meta} <span aria-hidden="true">→</span></span>
                </a>
              ))}
            </div>
          ) : (
            <div className="sheet">
              {set.items.map((it) => <Card item={it} key={it.id} />)}
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
