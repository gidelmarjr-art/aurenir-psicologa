import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { site } from '../../data/siteData'
import './AdminLogin.css'

// Traduz o erro do Supabase para algo que dá para resolver
function explain(err) {
  const text = `${err.code || ''} ${err.message || ''}`.toLowerCase()
  if (text.includes('email_not_confirmed') || text.includes('email not confirmed'))
    return 'Este e-mail ainda não foi confirmado. No Supabase, rode no SQL Editor: update auth.users set email_confirmed_at = now() where email = \'SEU-EMAIL\';'
  if (text.includes('invalid_credentials') || text.includes('invalid login credentials'))
    return 'E-mail ou senha incorretos. Confira se o usuário foi criado no MESMO projeto Supabase das chaves do .env (Authentication > Users).'
  if (text.includes('invalid api key') || text.includes('apikey'))
    return 'Chave do Supabase inválida. Confira VITE_SUPABASE_ANON_KEY no .env (use a chave "anon public") e reinicie o projeto.'
  if (text.includes('failed to fetch') || text.includes('network') || text.includes('fetch'))
    return 'Não foi possível conectar ao Supabase. Confira VITE_SUPABASE_URL no .env, reinicie o projeto e veja se o projeto Supabase não está pausado.'
  if (text.includes('provider') && text.includes('disabled'))
    return 'O login por e-mail está desligado. Ative em Authentication > Providers > Email.'
  return `Não foi possível entrar: ${err.message || 'erro desconhecido'}`
}

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (err) {
      setError(explain(err))
      setBusy(false)
    }
    // Em caso de sucesso, o painel detecta o login sozinho.
  }

  return (
    <div className="ad-login">
      <form className="ad-login__card" onSubmit={handleSubmit}>
        <h1>Painel de {site.name}</h1>
        <p className="ad-login__sub">Acesso restrito. Entre com o seu e-mail e senha.</p>

        <div className="ad-field">
          <label htmlFor="ad-email">E-mail</label>
          <input id="ad-email" className="ad-input" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="ad-field">
          <label htmlFor="ad-senha">Senha</label>
          <input id="ad-senha" className="ad-input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <p className="ad-msg ad-msg--error" role="alert">{error}</p>}
        <button className="ad-btn ad-btn--primary" type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
        <a className="ad-login__back" href="/">Voltar ao site</a>
      </form>
    </div>
  )
}
