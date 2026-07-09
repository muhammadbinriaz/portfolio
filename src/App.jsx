import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Work from './pages/Work'
import Playground from './pages/Playground'
import Loader from './components/Loader'
import TransitionOverlay from './components/TransitionOverlay'
import ErrorBoundary from './components/ErrorBoundary'
import { cover, reveal } from './lib/transition'
import { usePageCss } from './hooks/usePageCss'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  // Loader only on the home route's first load (matches original behaviour).
  const [loaded, setLoaded] = useState(() => location.pathname !== '/')

  // true only once the current route's stylesheet is actually applied.
  const cssReady = usePageCss(location.pathname)

  // Intercept .should link clicks -> run the block cover animation -> navigate (SPA).
  useEffect(() => {
    function onClick(e) {
      const link = e.target.closest('.should')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return
      if (href === window.location.pathname) return
      e.preventDefault()
      cover().then(() => navigate(href))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  // Reveal the blocks once the new route's page + its CSS are actually ready,
  // so the cover stays up over an unstyled frame instead of flickering.
  useEffect(() => {
    if (cssReady) reveal()
  }, [location.pathname, cssReady])

  // Pages only mount once their CSS is present, so their measurements and
  // entrance animations are always correct. Home additionally waits for the
  // first-load loader to finish before animating.
  return (
    <>
      <TransitionOverlay />
      {cssReady && !loaded && <Loader onDone={() => setLoaded(true)} />}
      <ErrorBoundary>
        {cssReady && (
          <Routes location={location}>
            <Route path="/" element={<Home animate={loaded} />} />
            <Route path="/work" element={<Work />} />
            <Route path="/playground" element={<Playground />} />
          </Routes>
        )}
      </ErrorBoundary>
    </>
  )
}
