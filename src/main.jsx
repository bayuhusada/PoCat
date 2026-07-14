import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: '9999px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 500,
            background: '#050038',
            color: '#FFFFFF'
          }
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
