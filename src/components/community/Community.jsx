import { site } from '../../data/siteData'
import Reveal from '../reveal/Reveal'
import './Community.css'

const Icon = {
  instagram: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 4 3 11l5.5 2L18 7l-7 7.5V19l3-3 4 3z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
    </svg>
  ),
}

export default function Community() {
  const channels = [
    { key: 'instagram', name: 'Instagram', text: 'Conteúdos curtos sobre saúde emocional.', href: site.social.instagram },
    { key: 'telegram', name: 'Telegram', text: 'Entre no grupo e receba as novidades.', href: site.social.telegram },
    { key: 'youtube', name: 'YouTube', text: 'Vídeos para assistir com calma.', href: site.social.youtube },
  ]

  return (
    <section id="comunidade" className="community">
      <div className="container">
        <Reveal>
        <h2 className="section-title">Continue o cuidado fora da sessão</h2>
        <p className="section-lead">Conteúdos gratuitos nas redes para acompanhar no seu tempo.</p>
        </Reveal>

        <Reveal as="ul" stagger className="community__grid">
          {channels.map((c) => (
            <li key={c.key}>
              <a className="community__link" href={c.href} target="_blank" rel="noopener noreferrer">
                <span className="community__icon">{Icon[c.key]}</span>
                <span className="community__name">{c.name}</span>
                <span className="community__text">{c.text}</span>
                <span className="visually-hidden">(abre em nova aba)</span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
