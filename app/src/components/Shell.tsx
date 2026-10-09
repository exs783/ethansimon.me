import { useState, type ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  CutoutCard,
  CutoutCardAction,
  CutoutCardImage,
  CutoutCardInsetLabel,
  CutoutCardMedia,
  CutoutCorner,
} from '@/components/ui/cutout-card'

const links = [
  { href: '#reel', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

const ext = (
  <>
    <ArrowUpRight aria-hidden="true" />
    <span className="sr-only">(opens in new tab)</span>
  </>
)

export function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header>
      <nav className="nav" aria-label="Primary">
        <span className="nav-brand">ETHAN SIMON</span>
        <div className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <Button
            variant="subtle"
            nativeButton={false}
            render={<a href="https://www.linkedin.com/in/ethansimon13" target="_blank" rel="noopener" />}
            className="ml-2"
          >
            LinkedIn{ext}
          </Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="subtle" size="icon" className="nav-menu" aria-label="Open menu" />}
          >
            <Menu aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="right" showCloseButton>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex flex-col gap-1 px-6 pt-16">
              {links.map((l) => (
                <SheetClose
                  key={l.href}
                  nativeButton={false}
                  render={<a href={l.href} className="sheet-link" />}
                >
                  {l.label}
                </SheetClose>
              ))}
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={<a href="https://www.linkedin.com/in/ethansimon13" target="_blank" rel="noopener" />}
                className="mt-4"
              >
                LinkedIn{ext}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}

export function Hero() {
  return (
    <section className="hero">
      <div>
        <h1>
          Junior Mechanical Engineering Student{' '}
          <span className="hero-sub">interested in mechanical and software integration</span>
        </h1>
        <p>Looking for a summer 2027 internship in mechanical or aerospace engineering.</p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" nativeButton={false} render={<a href="#reel" />}>
            See the projects <ArrowRight aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            variant="subtle"
            nativeButton={false}
            render={<a href="/assets/Ethan_Simon_Resume.pdf" target="_blank" rel="noopener" />}
          >
            Resume <ArrowUpRight aria-hidden="true" />
            <span className="sr-only">(PDF, opens in new tab)</span>
          </Button>
        </div>
      </div>
      <a className="hero-figure" href="/demos/compdrone-explode.html">
        <CutoutCard className="group/cutout relative block overflow-hidden bg-[var(--color-neutral-100)]">
          <CutoutCardMedia className="aspect-[5/4] w-full">
            <CutoutCardImage
              src="/assets/compdrone2025-render.webp"
              alt="Render of the CompDrone2025 hexacopter"
              width={1350}
              height={1080}
              fetchPriority="high"
              className="object-contain"
            />
          </CutoutCardMedia>
          <CutoutCardInsetLabel className="bottom-0 left-0 flex bg-[var(--color-bg)]">
            <CutoutCorner size={14} className="absolute bottom-full left-0 rotate-90 text-[var(--color-bg)]" />
            <CutoutCorner size={14} className="absolute bottom-0 left-full rotate-90 text-[var(--color-bg)]" />
            <div className="px-4 py-3">
              <span className="tb-label">Assembly</span>
              <span className="tb-value">CompDrone2025</span>
            </div>
            <div className="border-l border-[var(--color-divider)] py-3 pl-4 pr-6">
              <span className="tb-label">My part</span>
              <span className="tb-value">Frame and mounts</span>
            </div>
          </CutoutCardInsetLabel>
          <CutoutCardAction
            revealOnHover={false}
            className="right-0 top-0 flex items-center gap-2 bg-[var(--color-neutral-900)] px-4 py-3 text-[14px] font-extrabold text-[var(--color-bg)]"
          >
            Check out this project <ArrowRight aria-hidden="true" className="size-4" />
          </CutoutCardAction>
        </CutoutCard>
      </a>
    </section>
  )
}

export function Contact() {
  return (
    <section className="resume-band" id="contact" aria-labelledby="contact-title">
      <div>
        <h2 id="contact-title">Contact</h2>
        <p>
          I'm looking for a summer 2027 internship in mechanical or aerospace engineering. Project logs and test data on
          request.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg" variant="light" nativeButton={false} render={<a href="mailto:exs783@case.edu" />}>
          exs783@case.edu
        </Button>
        <Button
          size="lg"
          variant="light"
          nativeButton={false}
          render={<a href="/assets/Ethan_Simon_Resume.pdf" target="_blank" rel="noopener" />}
        >
          Resume{ext}
        </Button>
        <Button
          variant="ghostLight"
          nativeButton={false}
          render={<a href="https://www.linkedin.com/in/ethansimon13" target="_blank" rel="noopener" />}
        >
          LinkedIn{ext}
        </Button>
        <Button
          variant="ghostLight"
          nativeButton={false}
          render={<a href="https://github.com/exs783" target="_blank" rel="noopener" />}
        >
          GitHub{ext}
        </Button>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer>
      <span>© 2026 Ethan Simon — Mechanical Engineering</span>
      <span>Every number on this page is real, sourced from an actual repo, test run, or data file.</span>
    </footer>
  )
}

/** Markup not yet converted to components. It comes from ../index.html via scripts/port.py. */
export function Html({ html }: { html: string }) {
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export type { ReactNode }
