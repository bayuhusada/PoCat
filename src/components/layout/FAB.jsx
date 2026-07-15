import { useNavigate, useLocation } from 'react-router-dom'
import { HiCamera } from 'react-icons/hi'
import useAuth from '../../hooks/useAuth'

function FAB() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const isCameraPage = location.pathname === '/camera'

  if (isCameraPage || !user) return null

  return (
    <div className="flex justify-center" style={{ marginBottom: -28, position: 'relative', zIndex: 10 }}>
      <button
        onClick={() => navigate('/camera')}
        className="
          flex items-center justify-center
          bg-primary text-on-dark
          rounded-full shadow-elevated
          active:scale-90 transition-transform duration-150
        "
        style={{ width: 56, height: 56 }}
        aria-label="Buka Kamera"
      >
        <HiCamera size={26} />
      </button>
    </div>
  )
}

export default FAB