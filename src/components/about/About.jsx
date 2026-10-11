import { site } from '../../data/siteData'
import Reveal from '../reveal/Reveal'
import './About.css'

export default function About() {
  return (
    <section id="sobre-mim" className="about">
      <div className="container about__inner">
        <Reveal>
          <div className="about__photo-wrapper">
            <img 
              className="about__photo" 
              src="/materiais/person.png" 
              alt="Retrato da Psicóloga Aurenir Terto" 
            />
          </div>
        </Reveal>

        <Reveal className="about__content" delay={150}>
          <h2 className="section-title">Sobre Mim</h2>
          
          <div className="about__text">
            <p>
              Olá! Sou Aurenir Terto, psicóloga com atuação na abordagem da Terapia Cognitivo-Comportamental (TCC) – prática baseada em evidências –, unindo a escuta ativa a intervenções que respeitam a história e a singularidade de cada um no seu desenvolvimento e nas relações interpessoais.
            </p>
            <p>
              Ofereço um atendimento ético, acolhedor e focado em resultados práticos no dia a dia.
            </p>
            <p>
              Aqui, você encontrará o suporte necessário para se compreender melhor, desenvolver habilidades emocionais e construir mudanças possíveis e sustentáveis para uma rotina mais leve e funcional.
            </p>
            <p>
              Se você busca um espaço seguro de escuta, compreensão e transformação, será um prazer caminhar ao seu lado nesse processo.
            </p>
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