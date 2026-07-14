import { HiExclamationCircle, HiRefresh } from 'react-icons/hi'

function ErrorState({ title = 'Terjadi Kesalahan', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-4">
      <div className="w-16 h-16 rounded-full bg-pastel-coral flex items-center justify-center">
        <HiExclamationCircle size={32} className="text-danger" />
      </div>
      <h2 className="text-xl font-semibold text-primary">{title}</h2>
      {message && (
        <p className="text-slate text-sm text-center max-w-[260px]">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-primary text-on-dark rounded-full px-6 py-2.5 text-sm font-medium active:scale-95 transition-transform"
        >
          <HiRefresh size={16} />
          Coba Lagi
        </button>
      )}
    </div>
  )
}

export default ErrorState
