import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import BottomNav from './components/layout/BottomNav'
import FAB from './components/layout/FAB'
import ViewStack from './components/layout/ViewStack'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import CatDexPage from './pages/CatDexPage'
import BadgesPage from './pages/BadgesPage'
import CameraPage from './pages/CameraPage'

const pages = [
  { path: '/', Component: HomePage },
  { path: '/gallery', Component: GalleryPage },
  { path: '/catdex', Component: CatDexPage },
  { path: '/badges', Component: BadgesPage },
]

function App() {
  const [onboardingDone, setOnboardingDone] = useState(() => {
    return localStorage.getItem('pocat_onboarding') === 'done'
  })
  const location = useLocation()
  const isCameraPage = location.pathname === '/camera'

  function handleOnboardingComplete() {
    localStorage.setItem('pocat_onboarding', 'done')
    setOnboardingDone(true)
  }

  if (!onboardingDone) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="flex flex-col h-full bg-canvas">
      <main className="flex-1 overflow-hidden relative safe-top">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {pages.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ViewStack>
                    <Component />
                  </ViewStack>
                }
              />
            ))}
            <Route path="/camera" element={<CameraPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isCameraPage && (
        <>
          <FAB />
          <BottomNav />
        </>
      )}
    </div>
  )
}

export default App
