import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { HiExclamation } from 'react-icons/hi'
import useAuth from './hooks/useAuth'
import ErrorBoundary from './components/ui/ErrorBoundary'
import BottomNav from './components/layout/BottomNav'
import FAB from './components/layout/FAB'
import ViewStack from './components/layout/ViewStack'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import CatDexPage from './pages/CatDexPage'
import BadgesPage from './pages/BadgesPage'
import CameraPage from './pages/CameraPage'
import ProfilePage from './pages/ProfilePage'

const pages = [
  { path: '/', Component: HomePage },
  { path: '/gallery', Component: GalleryPage },
  { path: '/catdex', Component: CatDexPage },
  { path: '/badges', Component: BadgesPage },
]

function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6">
      <span className="text-5xl mb-4">🐱</span>
      <h2 className="text-xl font-bold text-primary mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-sm text-slate text-center">Halaman yang kamu cari tidak ada. Yuk hunting kucing!</p>
    </div>
  )
}

function App() {
  const { user, loading } = useAuth()
  const [onboardingDone, setOnboardingDone] = useState(() => {
    return localStorage.getItem('pocat_onboarding') === 'done'
  })
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const location = useLocation()
  const hideNav = location.pathname === '/camera' || location.pathname === '/profile'

  useEffect(() => {
    function goOnline() { setIsOnline(true) }
    function goOffline() { setIsOnline(false) }
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  function handleOnboardingComplete() {
    localStorage.setItem('pocat_onboarding', 'done')
    setOnboardingDone(true)
  }

  if (!onboardingDone) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-canvas">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <ErrorBoundary>
    <div className="flex flex-col h-full bg-canvas">
      {!isOnline && (
        <div className="flex items-center gap-2 px-4 py-2 bg-danger text-on-dark text-xs font-medium safe-top">
          <HiExclamation size={16} />
          Kamu sedang offline — beberapa fitur tidak tersedia
        </div>
      )}
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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!hideNav && (
        <>
          <FAB />
          <BottomNav />
        </>
      )}
    </div>
    </ErrorBoundary>
  )
}

export default App
