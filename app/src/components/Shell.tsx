import type { ReactNode } from 'react'

const Ext = () => (
  <>
    {' '}
    <span aria-hidden="true">↗</span>
    <span className="sr-only">(opens in new tab)</span>
  </>
)

export function Nav() {
  return (
    <header>
      <nav className="nav" aria-label="Primary">
        <span className="nav-brand">ETHAN SIMON</span>
        <a href="#reel">Projects</a>
        <a href="#about">About</a>
        <a className="nav-skills" href="#skills">Skills</a>
        <a href="#contact">Contact</a>
        <a
          className="btn btn-secondary nav-linkedin"
          href="https://www.linkedin.com/in/ethansimon13"
          target="_blank"
          rel="noopener"
          style={{ marginLeft: 8 }}
        >
          LinkedIn<Ext />
        </a>
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
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <a href="#reel" className="btn btn-primary">
            See the projects <span aria-hidden="true">→</span>
          </a>
          <a href="/assets/Ethan_Simon_Resume.pdf" target="_blank" rel="noopener" className="btn btn-secondary">
            Resume <span aria-hidden="true">↗</span>
            <span className="sr-only">(PDF, opens in new tab)</span>
          </a>
        </div>
      </div>
      <a className="hero-figure" href="/demos/compdrone-explode.html">
        <img
          src="/assets/compdrone2025-render.webp"
          alt="Render of the CompDrone2025 hexacopter"
          width={1350}
          height={1080}
          fetchPriority="high"
        />
        <div className="frame-tb">
          <div><span className="tb-label">Assembly</span><span className="tb-value">CompDrone2025</span></div>
          <div><span className="tb-label">My part</span><span className="tb-value">Frame and mounts</span></div>
          <div className="tb-wide tb-cta">
            <span className="tb-value">Check out this project <span aria-hidden="true">→</span></span>
          </div>
        </div>
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
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <a href="mailto:exs783@case.edu" className="btn btn-lg btn-light">exs783@case.edu</a>
        <a href="/assets/Ethan_Simon_Resume.pdf" target="_blank" rel="noopener" className="btn btn-lg btn-light">
          Resume<Ext />
        </a>
        <a href="https://www.linkedin.com/in/ethansimon13" target="_blank" rel="noopener" className="btn">
          LinkedIn<Ext />
        </a>
        <a href="https://github.com/exs783" target="_blank" rel="noopener" className="btn">
          GitHub<Ext />
        </a>
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
