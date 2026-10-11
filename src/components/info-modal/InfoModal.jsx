import { useState } from 'react'
import Modal from '../modal/Modal'
import { topics } from '../../data/siteData'
import './InfoModal.css'

export default function InfoModal({ topicId, onClose, onSchedule }) {
  const [activeId, setActiveId] = useState(topicId)
  const topic = topics.find((t) => t.id === activeId) ?? topics[0]

  return (
    <Modal title="Informações" onClose={onClose}>
      <div className="info__tabs" role="tablist" aria-label="Temas">
        {topics.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`aba-${t.id}`}
            aria-selected={t.id === topic.id}
            aria-controls="painel-info"
            className={`info__tab ${t.id === topic.id ? 'info__tab--active' : ''}`}
            onClick={() => setActiveId(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="info__panel" role="tabpanel" id="painel-info" aria-labelledby={`aba-${topic.id}`}>
        <h3 className="info__heading">{topic.name}</h3>
        <p>{topic.what}</p>

        <h4 className="info__sub">Sinais comuns</h4>
        <ul className="info__signs">
          {topic.signs.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h4 className="info__sub">Como a terapia ajuda</h4>
        <p>{topic.help}</p>

        {topic.alert && (
          <p className="info__alert" role="note">{topic.alert}</p>
        )}

        <button className="btn btn--primary info__cta" onClick={() => onSchedule(topic.id)}>
          Quero conversar sobre isso
        </button>
        <p className="info__disclaimer">
          Este conteúdo é informativo e não é um diagnóstico. Só uma avaliação profissional pode indicar o que está acontecendo com você.
        </p>
      </div>
    </Modal>
  )
}
