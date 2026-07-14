import { HiRefresh } from 'react-icons/hi'
import { getDailyMission, checkMissionCompletion } from '../../data/missions'

function DailyMission({ cats, completedMissions, onComplete }) {
  const mission = getDailyMission()
  const isDone = completedMissions.some(m => m.id === mission.id && m.date === new Date().toDateString())
  const canComplete = checkMissionCompletion(mission, cats, completedMissions)

  function handleComplete() {
    if (canComplete) {
      onComplete(mission)
    }
  }

  return (
    <div className="w-full bg-surface rounded-3xl p-4 border border-hairline-soft">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
          isDone ? 'bg-success/20' : 'bg-pastel-yellow'
        }`}>
          {isDone ? '✅' : mission.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-primary">{mission.title}</h4>
          <p className="text-xs text-slate mt-0.5">{mission.description}</p>
          <p className="text-[11px] font-semibold text-brand-yellow-deep mt-1">
            +{mission.reward} XP
          </p>
        </div>
        {isDone ? (
          <span className="text-xs font-semibold text-success whitespace-nowrap">
            Selesai
          </span>
        ) : (
          <button
            onClick={handleComplete}
            disabled={!canComplete}
            className={`
              text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap
              transition-all duration-150
              ${canComplete
                ? 'bg-primary text-on-dark active:scale-95'
                : 'bg-hairline text-slate'
              }
            `}
          >
            {canComplete ? 'Ambil' : 'Progress'}
          </button>
        )}
      </div>
    </div>
  )
}

export default DailyMission
