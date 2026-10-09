import { useLayoutEffect, useRef } from 'react'
import { Html } from '@/components/Shell'
import { DirectionAwareTabs } from '@/components/ui/direction-aware-tabs'
import data from '@/site/projects.json'

type Project = { id: string; head: string; tabs: { label: string; html: string }[] }
const projects = data as Project[]

/*
 * The write-ups are still the page's own HTML, and its script finds charts, canvases and 3D viewers
 * by id when it starts. Each tab's markup is therefore built once as a real DOM node. Tabs that are
 * not showing wait in a hidden store inside the document, so the script still sees them, and the
 * node moves into the panel when its tab opens. Nothing is torn down and redrawn on a tab change.
 */
const store = document.createElement('div')
store.id = 'panel-store'
store.hidden = true
document.body.appendChild(store)
const nodes = projects.map((p) =>
  p.tabs.map((t) => {
    const d = document.createElement('div')
    d.innerHTML = t.html
    store.appendChild(d)
    return d
  }),
)

function PanelHost({ node }: { node: HTMLElement }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    ref.current!.appendChild(node)
    // charts size themselves to their container, which was hidden until now
    const raf = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
    return () => {
      cancelAnimationFrame(raf)
      store.appendChild(node)
    }
  }, [node])
  return <div ref={ref} />
}

export function Projects() {
  return (
    <>
      {projects.map((p, pi) => (
        <section className="project-section" id={p.id} key={p.id}>
          <Html html={p.head} />
          <DirectionAwareTabs
            label={`${p.id.replace(/-/g, ' ')} sections`}
            tabs={p.tabs.map((t, ti) => ({ id: ti, label: t.label, content: <PanelHost node={nodes[pi][ti]} /> }))}
          />
        </section>
      ))}
    </>
  )
}
