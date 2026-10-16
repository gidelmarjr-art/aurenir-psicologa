import { useEffect, useState } from 'react'
import { fetchDashboard } from '../../services/dashboard'
import { fetchAvailableSlots } from '../../services/slots'
import { formatShortDay, formatTime } from '../../lib/dates'
import StatCard from '../stat-card/StatCard'
import LineChart from '../line-chart/LineChart'
import { IconBox, IconCalendar, IconChat, IconCheck, IconCursor } from '../icons/Icons'
import './AdminDashboard.css'

const n = (value) => Number(value ?? 0).toLocaleString('pt-BR')

const SERIES = [
  { key: 'clicks', label: 'Cliques em Comprar', color: 'var(--ad-accent)' },
  { key: 'requests', label: 'Pedidos de sessão', color: 'var(--ad-warm)' },
]

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [nextSlots, setNextSlots] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    Promise.all([fetchDashboard(14), fetchAvailableSlots(5)])
      .then(([stats, slots]) => { if (alive) { setData(stats); setNextSlots(slots) } })
      .catch(() => alive && setError('Não foi possível carregar o dashboard. Confira se o arquivo supabase/schema.sql foi executado no banco.'))
    return () => { alive = false }
  }, [])

  const maxClicks = Math.max(1, ...(data?.top_products ?? []).map((p) => p.clicks))

  return (
    <>
      <header className="ad-page-head">
        <h1>Geral</h1>
        <p>Resumo do seu site, em detalhe.</p>
      </header>

      {error && <p className="ad-msg ad-msg--error" role="alert">{error}</p>}
      {!data && !error && <p className="ad-hint">Carregando…</p>}

      {data && (
        <>
          <section className="ad-dash__stats" aria-label="Números principais">
            <StatCard label="Produtos ativos" value={n(data.products_active)} hint={`${n(data.products_total)} cadastrados`} icon={<IconBox />} />
            <StatCard label="Cliques em Comprar" value={n(data.clicks_30d)} hint="últimos 30 dias" icon={<IconCursor />} tone="warm" />
            <StatCard label="Horários livres" value={n(data.slots_available)} hint="de hoje em diante" icon={<IconCalendar />} tone="ok" />
            <StatCard label="Horários reservados" value={n(data.slots_booked)} hint="marcados por você" icon={<IconCheck />} tone="muted" />
            <StatCard label="Pedidos de sessão" value={n(data.requests_30d)} hint="últimos 30 dias" icon={<IconChat />} />
          </section>

          <section className="ad-card ad-dash__chart">
            <div className="ad-dash__chart-head">
              <div>
                <h2 className="ad-card__title">Atividade dos últimos 14 dias</h2>
                <p className="ad-card__sub">Cliques nos materiais e pedidos de sessão enviados pelo site.</p>
              </div>
              <ul className="ad-dash__legend">
                {SERIES.map((s) => (
                  <li key={s.key}><span className="ad-dash__swatch" style={{ background: s.color }} />{s.label}</li>
                ))}
              </ul>
            </div>
            <LineChart data={data.series} series={SERIES} ariaLabel="Gráfico de cliques e pedidos de sessão nos últimos 14 dias" />
          </section>

          <div className="ad-dash__lists">
            <section className="ad-card">
              <div className="ad-dash__list-head">
                <h2 className="ad-card__title">Próximos horários livres</h2>
                <a className="ad-dash__link" href="#/datas">Gerenciar datas</a>
              </div>
              {nextSlots.length === 0 ? (
                <p className="ad-dash__empty">Nenhum horário livre cadastrado. Adicione datas na aba Datas.</p>
              ) : (
                <ul className="ad-dash__rows">
                  {nextSlots.map((s) => (
                    <li key={s.id}><span className="ad-dash__cap">{formatShortDay(s.startsAt)}</span><strong>{formatTime(s.startsAt)}</strong></li>
                  ))}
                </ul>
              )}
            </section>

            <section className="ad-card">
              <div className="ad-dash__list-head">
                <h2 className="ad-card__title">Materiais mais clicados</h2>
                <a className="ad-dash__link" href="#/produtos">Gerenciar produtos</a>
              </div>
              {data.top_products.length === 0 ? (
                <p className="ad-dash__empty">Ainda não há produtos cadastrados.</p>
              ) : (
                <ul className="ad-dash__rows">
                  {data.top_products.map((p) => (
                    <li key={p.id} className="ad-dash__top">
                      <span className="ad-dash__top-title">{p.title}</span>
                      <span className="ad-dash__bar" aria-hidden="true"><span style={{ width: `${(p.clicks / maxClicks) * 100}%` }} /></span>
                      <strong>{n(p.clicks)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </>
  )
}
