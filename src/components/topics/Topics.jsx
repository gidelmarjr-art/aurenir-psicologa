import { useState } from 'react'
import { topics } from '../../data/siteData'
import Reveal from '../reveal/Reveal'
import './Topics.css'

// FAQ em formato de sanfona: clicar abre o conteúdo logo abaixo do tema.
// Só um tema fica aberto por vez (clicar de novo fecha).
export default function Topics({ onSchedule }) {
  const [openId, setOpenId] = useState(null)
  const toggle = (id) => setOpenId((current) => (current === id ? null : id))

  return (
    <section id="temas" className="topics">
      <div className="container">
        <Reveal>
          <h2 className="section-title">Entenda o que você está sentindo</h2>
          <p className="section-lead">
            Toque em um tema para ler sobre o que é, quais são os sinais mais comuns e como a terapia pode ajudar.
          </p>
        </Reveal>

        <Reveal as="ul" stagger className="topics__list">
          {topics.map((t) => {
            const open = openId === t.id
            return (
              <li key={t.id} className={`topics__item ${open ? 'topics__item--open' : ''}`}>
                <h3 className="topics__heading">
                  <button
                    className="topics__trigger"
                    id={`faq-botao-${t.id}`}
                    aria-expanded={open}
                    aria-controls={`faq-painel-${t.id}`}
                    onClick={() => toggle(t.id)}
                  >
                    <span className="topics__name">{t.name}</span>
                    <span className="topics__tagline">{t.tagline}</span>
                    <span className="topics__icon" aria-hidden="true" />
                  </button>
                </h3>

                <div
                  className="topics__panel"
                  id={`faq-painel-${t.id}`}
                  role="region"
                  aria-labelledby={`faq-botao-${t.id}`}
                >
                  <div className="topics__panel-inner">
                    <div className="topics__content">
                      <div className="topics__col">
                        <h4 className="topics__sub">O que é</h4>
                        <p>{t.what}</p>
                        <h4 className="topics__sub">Como a terapia ajuda</h4>
                        <p>{t.help}</p>
                      </div>
                      <div className="topics__col">
                        <h4 className="topics__sub">Sinais comuns</h4>
                        <ul className="topics__signs">
                          {t.signs.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {t.alert && (
                      <p className="topics__alert" role="note">{t.alert}</p>
                    )}

                    <div className="topics__footer">
                      <button className="btn btn--primary" onClick={() => onSchedule(t.id)}>
                        Quero conversar sobre isso
                      </button>
                      <p className="topics__disclaimer">
                        Conteúdo informativo, não é um diagnóstico. Só uma avaliação profissional pode indicar o que está acontecendo com você.
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
