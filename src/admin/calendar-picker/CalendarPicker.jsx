import { todayKey } from '../../lib/dates'
import { IconChevronLeft, IconChevronRight } from '../icons/Icons'
import './CalendarPicker.css'

const WEEK = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const WEEK_FULL = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const pad = (n) => String(n).padStart(2, '0')

// Calendário mensal: clique nos dias para marcar/desmarcar vários de uma vez.
//  selected: Set de 'YYYY-MM-DD' marcados agora | marked: dias que já têm horários cadastrados
export default function CalendarPicker({ year, month, onChangeMonth, selected, marked, onToggle }) {
  const today = todayKey()
  const [ty, tm] = today.split('-').map(Number)
  const canGoBack = year > ty || (year === ty && month + 1 > tm)

  const blanks = new Date(year, month, 1).getDay()
  const total = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: total }, (_, i) => `${year}-${pad(month + 1)}-${pad(i + 1)}`)

  return (
    <div className="ad-cal">
      <div className="ad-cal__head">
        <button type="button" className="ad-cal__nav" onClick={() => onChangeMonth(-1)} disabled={!canGoBack} aria-label="Mês anterior">
          <IconChevronLeft />
        </button>
        <strong className="ad-cal__title">{MONTHS[month]} de {year}</strong>
        <button type="button" className="ad-cal__nav" onClick={() => onChangeMonth(1)} aria-label="Próximo mês">
          <IconChevronRight />
        </button>
      </div>

      <div className="ad-cal__grid" role="group" aria-label={`Dias de ${MONTHS[month]}`}>
        {WEEK.map((w, i) => (
          <span key={i} className="ad-cal__week" title={WEEK_FULL[i]}>{w}</span>
        ))}
        {Array.from({ length: blanks }, (_, i) => <span key={`b${i}`} />)}
        {days.map((key) => {
          const past = key < today
          const isSelected = selected.has(key)
          return (
            <button
              type="button"
              key={key}
              disabled={past}
              aria-pressed={isSelected}
              aria-label={`${Number(key.slice(8))} de ${MONTHS[month]}${marked.has(key) ? ', já tem horários' : ''}`}
              className={['ad-cal__day', isSelected && 'ad-cal__day--on', key === today && 'ad-cal__day--today', marked.has(key) && 'ad-cal__day--marked'].filter(Boolean).join(' ')}
              onClick={() => onToggle(key)}
            >
              {Number(key.slice(8))}
            </button>
          )
        })}
      </div>
      <p className="ad-cal__legend"><span className="ad-cal__dot" /> dia que já tem horários</p>
    </div>
  )
}
