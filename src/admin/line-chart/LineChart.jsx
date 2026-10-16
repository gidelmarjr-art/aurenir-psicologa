import './LineChart.css'

const W = 800, H = 260
const PAD = { top: 12, right: 16, bottom: 30, left: 40 }

// Gráfico de linhas simples em SVG (sem biblioteca).
// series: [{ key, label, color }]  |  data: [{ day: 'YYYY-MM-DD', [key]: número }]
export default function LineChart({ data, series, ariaLabel }) {
  const maxValue = Math.max(...data.flatMap((d) => series.map((s) => d[s.key] ?? 0)), 0)
  const yMax = Math.max(4, Math.ceil(maxValue / 4) * 4) // sempre de 4 em 4: marcas inteiras
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (i) => PAD.left + (data.length <= 1 ? innerW / 2 : (i * innerW) / (data.length - 1))
  const y = (v) => PAD.top + innerH - (v / yMax) * innerH
  const ticks = [0, 1, 2, 3, 4].map((n) => (yMax / 4) * n)
  const label = (day) => `${day.slice(8, 10)}/${day.slice(5, 7)}`

  return (
    <svg className="ad-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="ad-chart__grid" />
          <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="ad-chart__tick">{t}</text>
        </g>
      ))}
      {data.map((d, i) =>
        i % 2 === 0 || i === data.length - 1 ? (
          <text key={d.day} x={x(i)} y={H - 8} textAnchor="middle" className="ad-chart__tick">{label(d.day)}</text>
        ) : null,
      )}
      {series.map((s) => (
        <g key={s.key} style={{ color: s.color }}>
          <polyline
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
            points={data.map((d, i) => `${x(i)},${y(d[s.key] ?? 0)}`).join(' ')}
          />
          {data.map((d, i) => (
            <circle key={d.day} cx={x(i)} cy={y(d[s.key] ?? 0)} r="3.5" fill="currentColor">
              <title>{`${label(d.day)} · ${s.label}: ${d[s.key] ?? 0}`}</title>
            </circle>
          ))}
        </g>
      ))}
    </svg>
  )
}
