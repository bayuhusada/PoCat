import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center px-6 gap-4 bg-canvas">
          <div className="w-16 h-16 rounded-3xl bg-danger/10 flex items-center justify-center text-3xl">
            😿
          </div>
          <h2 className="text-lg font-bold text-primary text-center">Ada yang error</h2>
          <p className="text-sm text-slate text-center max-w-xs">
            Coba reload halaman atau hapus data localStorage jika masalah berlanjut.
          </p>
          <button
            onClick={() => { localStorage.removeItem('pocat_data'); window.location.reload() }}
            className="bg-primary text-on-dark rounded-full px-6 py-2.5 text-sm font-medium"
          >
            Reset & Reload
          </button>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-slate underline"
          >
            Reload aja
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
