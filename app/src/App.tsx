import { useEffect } from 'react'
import './site/site.css'
import { Contact, Footer, Hero, Html, Nav } from './components/Shell'
import { initLegacy } from './site/legacy.js'
import about from './site/parts/about.html?raw'
import projects from './site/parts/projects.html?raw'
import reel from './site/parts/reel.html?raw'

let started = false

export default function App() {
  // The charts, 3D viewers and hash-routed project pages are still the page's own script.
  // It needs the markup above in the DOM, so it starts after the first render, once.
  useEffect(() => {
    if (started) return
    started = true
    initLegacy()
    // A deep link (#mission-model) was followed before React put the section in the page, so the
    // browser never marked it :target. Drop the hash and navigate to it again, replacing the history entry.
    const hash = location.hash
    if (hash.length > 1) {
      history.replaceState(null, '', location.pathname + location.search)
      location.replace(location.pathname + location.search + hash)
    }
  }, [])

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Html html={reel} />
        <Html html={projects} />
        <Html html={about} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
