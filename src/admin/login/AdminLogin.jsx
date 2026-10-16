import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { site } from '../../data/siteData'
import './AdminLogin.css'

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
      setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : 'Não foi possível entrar. Tente de novo em instantes.')
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
