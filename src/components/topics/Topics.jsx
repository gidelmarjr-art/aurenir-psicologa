import { topics } from '../../data/siteData'
import './Topics.css'

export default function Topics({ onOpen }) {
  return (
    <section id="temas" className="topics">
      <div className="container">
        <h2 className="section-title">Entenda o que você está sentindo</h2>
        <p className="section-lead">
          Toque em um tema para ler sobre o que é, quais são os sinais mais comuns e como a terapia pode ajudar.
        </p>

        <ul className="topics__list">
          {topics.map((t) => (
            <li key={t.id}>
              <button className="topics__row" onClick={() => onOpen(t.id)} aria-label={`Ler sobre ${t.name}`}>
                <span className="topics__name">{t.name}</span>
                <span className="topics__tagline">{t.tagline}</span>
                <span className="topics__go" aria-hidden="true">+</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
