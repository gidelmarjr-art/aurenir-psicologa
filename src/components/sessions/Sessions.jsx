import { site } from '../../data/siteData'
import './Sessions.css'

const steps = [
  { title: 'Você envia a solicitação', text: 'Preencha o formulário rápido. Não precisa detalhar o que sente agora.' },
  { title: 'Primeira conversa', text: 'Combinamos dia e horário e nos conhecemos, para entender o que você procura.' },
  { title: 'Acompanhamento', text: 'As sessões seguem num ritmo combinado com você, com sigilo e respeito.' },
]

export default function Sessions({ onSchedule }) {
  return (
    <section id="atendimento" className="sessions">
      <div className="container sessions__inner">
        <div>
          <h2 className="section-title">Como funciona o atendimento online</h2>
          <ol className="sessions__steps">
            {steps.map((s, i) => (
              <li key={s.title} className="sessions__step">
                <span className="sessions__num" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="sessions__step-title">{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="sessions__panel" aria-label="Informações da sessão">
          <h3>Sua sessão</h3>
          <dl>
            <div><dt>Formato</dt><dd>{site.session.format}</dd></div>
            <div><dt>Duração</dt><dd>{site.session.duration}</dd></div>
            <div><dt>Sigilo</dt><dd>Garantido pelo Código de Ética da Psicologia</dd></div>
          </dl>
          <button className="btn sessions__cta" onClick={onSchedule}>Agendar sessão online</button>
        </aside>
      </div>
    </section>
  )
}
