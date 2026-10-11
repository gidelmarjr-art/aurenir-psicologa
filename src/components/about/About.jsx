import { site } from '../../data/siteData'
import './About.css'

// Iniciais para o retrato provisório. Para usar uma foto, troque o <div className="about__photo"> por
// <img className="about__photo" src="/foto-psicologa.jpg" alt="Retrato da psicóloga" /> e coloque a imagem na pasta public/.
const initials = site.name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((w) => w[0])
  .join('')

export default function About() {
  return (
    <section id="quem-somos" className="about">
      <div className="container about__inner">
        <div className="about__photo" role="img" aria-label="Espaço reservado para a foto da psicóloga">
          <span>{initials}</span>
        </div>

        <div className="about__content">
          <h2 className="section-title">Quem somos</h2>
          <div className="about__text">
            {site.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="about__details">
            {site.about.details.map((d) => (
              <div key={d.label} className="about__detail">
                <dt>{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
