import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

// O painel só é baixado por quem abre /admin: o site público continua leve.
const Admin = lazy(() => import('./admin/Admin'))
const isAdminRoute = window.location.pathname.replace(/\/+$/, '').startsWith('/admin')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
