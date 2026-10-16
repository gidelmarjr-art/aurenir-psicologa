import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { site } from '../data/siteData'
import AdminLogin from './login/AdminLogin'
import AdminDashboard from './dashboard/AdminDashboard'
import AdminProducts from './products/AdminProducts'
import AdminDates from './dates/AdminDates'
import { IconBox, IconCalendar, IconExternal, IconGrid, IconLogout, IconMoon, IconSun } from './icons/Icons'
import './Admin.css'

const PAGES = [
  { id: '', label: 'Geral', icon: <IconGrid /> },
  { id: 'produtos', label: 'Produtos', icon: <IconBox /> },
  { id: 'datas', label: 'Datas', icon: <IconCalendar /> },
]

const pageFromHash = () => window.location.hash.replace(/^#\/?/, '')
const initials = site.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('')

function readTheme() {
  try { return localStorage.getItem('admin-theme') || 'dark' } catch { return 'dark' }
}

export default function Admin() {
  // 'loading' | 'unconfigured' | 'out' | 'forbidden' | 'in'
  const [auth, setAuth] = useState({ status: isSupabaseConfigured ? 'loading' : 'unconfigured' })
  const [page, setPage] = useState(pageFromHash)
  const [theme, setTheme] = useState(readTheme)

  // Painel não deve aparecer em buscadores
  useEffect(() => {
    document.title = 'Painel | ' + site.name
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    const previousBg = document.body.style.background
    return () => { meta.remove(); document.body.style.background = previousBg }
  }, [])

  useEffect(() => {
    const onHash = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Login: confere a sessão e se o usuário está na tabela "admins"
  useEffect(() => {
    if (!supabase) return
    let alive = true

    const check = async (session) => {
      if (!session) { if (alive) setAuth({ status: 'out' }); return }
      const { data, error } = await supabase.rpc('is_admin')
      if (!alive) return
      if (error) setAuth({ status: 'forbidden', email: session.user.email, userId: session.user.id, setupError: error.message })
      else if (data !== true) setAuth({ status: 'forbidden', email: session.user.email, userId: session.user.id })
      else setAuth({ status: 'in', email: session.user.email })
    }

    supabase.auth.getSession().then(({ data }) => check(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // setTimeout: o Supabase pede para não chamar o banco direto dentro deste callback
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') setTimeout(() => check(session), 0)
    })
    return () => { alive = false; subscription.unsubscribe() }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem('admin-theme', next) } catch { /* sem armazenamento: tudo bem */ }
  }
  const signOut = () => supabase.auth.signOut()

  const shell = (children) => <div className="admin" data-theme={theme}>{children}</div>

  if (auth.status === 'loading') return shell(<p className="ad-center">Carregando…</p>)

  if (auth.status === 'unconfigured') {
    return shell(
      <div className="ad-center ad-notice">
        <h1>Banco de dados não configurado</h1>
        <p>Crie o arquivo <code>.env</code> com <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> (veja o <code>.env.example</code> e o README) e reinicie o projeto.</p>
        <a className="ad-btn ad-btn--ghost" href="/">Voltar ao site</a>
      </div>,
    )
  }

  if (auth.status === 'out') return shell(<AdminLogin />)

  if (auth.status === 'forbidden') {
    return shell(
      <div className="ad-center ad-notice">
        <h1>{auth.setupError ? 'Banco ainda não preparado' : 'Falta autorizar este usuário'}</h1>
        {auth.setupError ? (
          <p>O login funcionou, mas o banco não respondeu à checagem de administrador ({auth.setupError}). Rode o arquivo <code>supabase/schema.sql</code> no SQL Editor do Supabase e entre de novo.</p>
        ) : (
          <>
            <p>O login de <strong>{auth.email}</strong> funcionou, mas este usuário ainda não está na lista de administradores. Rode no SQL Editor do Supabase:</p>
            <code className="ad-notice__sql">insert into public.admins (user_id) values ('{auth.userId}');</code>
            <p>Depois, clique em Sair e entre de novo.</p>
          </>
        )}
        <button className="ad-btn ad-btn--primary" onClick={signOut}>Sair</button>
      </div>,
    )
  }

  return shell(
    <>
      <aside className="ad-side">
        <div className="ad-brand">
          <span className="ad-brand__logo">{initials}</span>
          <span className="ad-brand__name">{site.name}</span>
        </div>

        <nav className="ad-nav" aria-label="Painel">
          {PAGES.map((p) => (
            <a
              key={p.id}
              href={`#/${p.id}`}
              className={`ad-nav__link ${page === p.id ? 'ad-nav__link--on' : ''}`}
              aria-current={page === p.id ? 'page' : undefined}
            >
              {p.icon}
              <span>{p.label}</span>
            </a>
          ))}
        </nav>

        <div className="ad-side__foot">
          <a className="ad-nav__link" href="/" target="_blank" rel="noopener noreferrer">
            <IconExternal />
            <span>Ver o site</span>
          </a>
          <button className="ad-side__theme" onClick={toggleTheme}>
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
            <span>{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</span>
          </button>
          <p className="ad-side__email" title={auth.email}>{auth.email}</p>
          <button className="ad-nav__link ad-nav__link--button" onClick={signOut}>
            <IconLogout />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="ad-main">
        {page === 'produtos' && <AdminProducts />}
        {page === 'datas' && <AdminDates />}
        {page !== 'produtos' && page !== 'datas' && <AdminDashboard />}
      </main>
    </>,
  )
}
