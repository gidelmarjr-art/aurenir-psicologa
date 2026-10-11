import { site } from '../../data/siteData'
import Reveal from '../reveal/Reveal'
import './About.css'

export default function About() {
  return (
    <section id="quem-somos" className="about">
      <div className="container about__inner">
        <Reveal>
          <img 
            className="about__photo" 
            src="/materiais/person.png" 
            alt="Retrato da psicóloga" 
          />
        </Reveal>

        <Reveal className="about__content" delay={150}>
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
        </Reveal>
      </div>
    </section>
  )
}