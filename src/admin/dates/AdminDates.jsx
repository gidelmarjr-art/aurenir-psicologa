import { useCallback, useEffect, useMemo, useState } from 'react'
import { createSlots, deleteSlots, fetchUpcomingSlots, setSlotStatus } from '../../services/slots'
import { dayKey, formatDayFromKey, formatTime, groupByDay, todayKey, toIso } from '../../lib/dates'
import CalendarPicker from '../calendar-picker/CalendarPicker'
import { IconPlus, IconTrash } from '../icons/Icons'
import './AdminDates.css'

const PRESETS = [
  { label: 'Manhã (8h às 11h)', times: ['08:00', '09:00', '10:00', '11:00'] },
  { label: 'Tarde (14h às 17h)', times: ['14:00', '15:00', '16:00', '17:00'] },
  { label: 'Noite (18h às 20h)', times: ['18:00', '19:00', '20:00'] },
]

export default function AdminDates() {
  const [{ y, m }, setMonth] = useState(() => {
    const [yy, mm] = todayKey().split('-').map(Number)
    return { y: yy, m: mm - 1 }
  })
  const [selectedDays, setSelectedDays] = useState(() => new Set())
  const [times, setTimes] = useState([])
  const [timeInput, setTimeInput] = useState('09:00')
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  const load = useCallback(async () => {
    try { setSlots(await fetchUpcomingSlots()) }
    catch { setMsg({ type: 'error', text: 'Não foi possível carregar os horários.' }) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const changeMonth = (delta) =>
    setMonth(({ y: yy, m: mm }) => {
      const d = new Date(yy, mm + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })

  const toggleDay = (key) =>
    setSelectedDays((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const addTimes = (list) => setTimes((prev) => [...new Set([...prev, ...list])].sort())
  const addTypedTime = () => { if (/^\d{2}:\d{2}$/.test(timeInput)) addTimes([timeInput]) }
  const removeTime = (t) => setTimes((prev) => prev.filter((x) => x !== t))

  // Combina cada dia marcado com cada horário e descarta o que já passou
  const toCreate = useMemo(() => {
    const now = Date.now()
    const list = []
    for (const day of [...selectedDays].sort())
      for (const t of times) {
        const iso = toIso(day, t)
        if (new Date(iso).getTime() > now) list.push(iso)
      }
    return list
  }, [selectedDays, times])

  const handleCreate = async () => {
    setBusy(true)
    setMsg(null)
    try {
      const created = await createSlots(toCreate)
      const skipped = toCreate.length - created
      setMsg({ type: 'ok', text: `${created} horário(s) adicionado(s)${skipped ? ` (${skipped} já existia(m))` : ''}.` })
      setSelectedDays(new Set())
      await load()
    } catch {
      setMsg({ type: 'error', text: 'Não foi possível adicionar os horários.' })
    } finally { setBusy(false) }
  }

  const toggleStatus = async (slot) => {
    try { await setSlotStatus(slot.id, slot.status === 'available' ? 'booked' : 'available'); await load() }
    catch { setMsg({ type: 'error', text: 'Não foi possível alterar o horário.' }) }
  }

  const removeSlots = async (ids, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return
    try { await deleteSlots(ids); await load() }
    catch { setMsg({ type: 'error', text: 'Não foi possível remover.' }) }
  }

  const markedDays = useMemo(() => new Set(slots.map((s) => dayKey(s.startsAt))), [slots])
  const grouped = groupByDay(slots)

  return (
    <>
      <header className="ad-page-head">
        <h1>Datas</h1>
        <p>Escolha os dias e horários em que você atende. A visitante vê só os horários livres.</p>
      </header>

      {msg && <p className={`ad-msg ad-msg--${msg.type}`} role={msg.type === 'error' ? 'alert' : 'status'}>{msg.text}</p>}

      <div className="ad-dates">
        <section className="ad-card ad-dates__new" aria-label="Adicionar horários">
          <div>
            <h2 className="ad-card__title">1. Escolha os dias</h2>
            <p className="ad-card__sub">Clique em vários dias de uma vez.</p>
          </div>
          <CalendarPicker year={y} month={m} onChangeMonth={changeMonth} selected={selectedDays} marked={markedDays} onToggle={toggleDay} />

          <div>
            <h2 className="ad-card__title">2. Defina os horários</h2>
            <p className="ad-card__sub">Valem para todos os dias marcados (horário de Brasília).</p>
          </div>
          <div className="ad-dates__presets">
            {PRESETS.map((p) => (
              <button key={p.label} type="button" className="ad-btn ad-btn--ghost ad-dates__preset" onClick={() => addTimes(p.times)}>{p.label}</button>
            ))}
          </div>
          <div className="ad-dates__typed">
            <label className="visually-hidden" htmlFor="dt-hora">Outro horário</label>
            <input id="dt-hora" className="ad-input" type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} />
            <button type="button" className="ad-btn ad-btn--ghost" onClick={addTypedTime}><IconPlus /> Adicionar horário</button>
          </div>
          {times.length > 0 && (
            <ul className="ad-dates__chips" aria-label="Horários escolhidos">
              {times.map((t) => (
                <li key={t}>
                  <button type="button" className="ad-dates__chip" onClick={() => removeTime(t)} aria-label={`Remover ${t}`}>{t} <span aria-hidden="true">×</span></button>
                </li>
              ))}
            </ul>
          )}

          <button className="ad-btn ad-btn--primary" onClick={handleCreate} disabled={busy || toCreate.length === 0}>
            {busy ? 'Adicionando…' : toCreate.length === 0 ? 'Marque dias e horários para adicionar' : `Adicionar ${toCreate.length} horário(s)`}
          </button>
        </section>

        <section className="ad-card" aria-label="Horários cadastrados">
          <h2 className="ad-card__title">Horários cadastrados</h2>
          <p className="ad-card__sub">Marque como "Reservado" quando confirmar com a paciente. Reservados somem do site.</p>
          {loading && <p className="ad-hint">Carregando…</p>}
          {!loading && grouped.length === 0 && <p className="ad-dates__empty">Nenhum horário futuro cadastrado.</p>}

          <div className="ad-dates__days">
            {grouped.map(([key, list]) => (
              <div key={key} className="ad-dates__day">
                <div className="ad-dates__day-head">
                  <strong>{formatDayFromKey(key)}</strong>
                  <button type="button" className="ad-btn ad-btn--danger ad-dates__clear" onClick={() => removeSlots(list.map((s) => s.id), `Remover todos os horários de ${formatDayFromKey(key)}?`)}>Remover dia</button>
                </div>
                <ul className="ad-dates__slots">
                  {list.map((s) => (
                    <li key={s.id} className={`ad-dates__slot ${s.status === 'booked' ? 'ad-dates__slot--booked' : ''}`}>
                      <strong>{formatTime(s.startsAt)}</strong>
                      <button type="button" className={`ad-badge ad-dates__status ${s.status === 'available' ? 'ad-badge--ok' : 'ad-badge--warm'}`} onClick={() => toggleStatus(s)} aria-label={`Horário ${formatTime(s.startsAt)}: ${s.status === 'available' ? 'livre, clique para marcar como reservado' : 'reservado, clique para liberar'}`}>
                        {s.status === 'available' ? 'Livre' : 'Reservado'}
                      </button>
                      <button type="button" className="ad-icon-btn ad-icon-btn--danger ad-dates__del" onClick={() => removeSlots([s.id])} aria-label={`Remover horário ${formatTime(s.startsAt)}`}><IconTrash /></button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
