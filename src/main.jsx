import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

// O painel só é baixado por quem abre /admin: o site público continua leve.
const Admin = lazy(() => import('./admin/Admin'))
const MaterialsPage = lazy(() => import('./components/materials-page/MaterialsPage'))
const path = window.location.pathname.replace(/\/+$/, '')
const isAdminRoute = path.startsWith('/admin')
const isMaterialsRoute = path === '/materiais'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ) : isMaterialsRoute ? (
      <Suspense fallback={null}>
        <MaterialsPage />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
