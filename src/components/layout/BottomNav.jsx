import { useNavigate, useLocation } from 'react-router-dom'
import { HiOutlineHome, HiOutlinePhotograph, HiOutlineCollection, HiOutlineBadgeCheck } from 'react-icons/hi'

const tabs = [
  { path: '/', icon: HiOutlineHome, label: 'Home' },
  { path: '/gallery', icon: HiOutlinePhotograph, label: 'Gallery' },
  { path: '/catdex', icon: HiOutlineCollection, label: 'CatDex' },
  { path: '/badges', icon: HiOutlineBadgeCheck, label: 'Badges' },
]

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="flex items-center justify-around bg-canvas border-t border-hairline px-2 safe-bottom" style={{ height: 56 }}>
      {tabs.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path

        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`
              flex flex-col items-center justify-center gap-0.5
              px-4 py-1 rounded-full transition-all duration-150
              ${isActive
                ? 'bg-primary text-on-dark'
                : 'text-steel hover:text-charcoal'
              }
            `}
            style={{ height: 40 }}
          >
            <Icon size={22} />
            <span className="text-[11px] font-semibold leading-none tracking-wider uppercase">
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav
