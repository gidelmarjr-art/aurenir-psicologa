// Todas as datas do site são exibidas no horário de Brasília.
// (O Brasil não tem horário de verão desde 2019, então o fuso fixo é -03:00.)
const TZ = 'America/Sao_Paulo'

const dayFmt = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' })
const shortDayFmt = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, weekday: 'short', day: '2-digit', month: '2-digit' })
const timeFmt = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })
const keyFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })

/** '2026-10-15T12:00:00Z' -> '2026-10-15' (dia em Brasília) */
export const dayKey = (iso) => keyFmt.format(new Date(iso))
export const todayKey = () => keyFmt.format(new Date())
export const formatTime = (iso) => timeFmt.format(new Date(iso))
export const formatDay = (iso) => dayFmt.format(new Date(iso))
export const formatShortDay = (iso) => shortDayFmt.format(new Date(iso))

/** '2026-10-15' -> 'quinta-feira, 15 de outubro' */
export const formatDayFromKey = (key) => formatDay(`${key}T12:00:00-03:00`)

/** ('2026-10-15', '09:30') -> '2026-10-15T09:30:00-03:00' */
export const toIso = (key, time) => `${key}T${time}:00-03:00`

/** Agrupa horários por dia: [['2026-10-15', [slot, slot]], ...] (mantém a ordem recebida) */
export function groupByDay(slots) {
  const map = new Map()
  for (const slot of slots) {
    const key = dayKey(slot.startsAt)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(slot)
  }
  return [...map.entries()]
}
