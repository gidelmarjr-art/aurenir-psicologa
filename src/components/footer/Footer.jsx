import { site } from '../../data/siteData'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__urgent">
          <strong>Em crise ou com risco à vida?</strong> Ligue 188 (CVV, 24 horas, gratuito) ou 192 (SAMU).
        </p>
        <p className="footer__note">
          Este site tem caráter informativo e não substitui avaliação e acompanhamento psicológico ou médico.
        </p>
        <p className="footer__copy">
          {site.name} · {site.crp} · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
