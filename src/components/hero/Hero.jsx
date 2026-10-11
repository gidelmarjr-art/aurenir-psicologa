import './Hero.css'

export default function Hero({ onSchedule }) {
  return (
    <section id="inicio" className="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 className="hero__title">Um espaço para respirar e se escutar.</h1>
          <p className="hero__lead">
            Psicoterapia online com acolhimento e sigilo, para você lidar com estresse,
            ansiedade, depressão e traumas no seu ritmo.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={onSchedule}>
              Agendar sessão online
            </button>
            <a className="btn btn--ghost" href="#quem-somos">
              Quem somos
            </a>
          </div>
          <ul className="hero__facts">
            <li>Atendimento 100% online</li>
            <li>Sigilo profissional</li>
            <li>Sessões por videochamada</li>
          </ul>
        </div>

        {/* Elemento de destaque: círculo que "respira". Decorativo, por isso aria-hidden. */}
        <div className="hero__visual">
          <div className="breath" aria-hidden="true">
            <div className="breath__ring" />
            <div className="breath__orb" />
            <span className="breath__label breath__label--in">Inspire</span>
            <span className="breath__label breath__label--out">Expire</span>
            <span className="breath__label breath__label--static">Respire</span>
          </div>
          <p className="hero__caption">Inspire enquanto o círculo cresce. Expire enquanto ele diminui.</p>
        </div>
      </div>
    </section>
  )
}
