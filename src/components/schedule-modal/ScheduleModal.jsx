import { useState } from 'react'
import Modal from '../modal/Modal'
import { site, topics } from '../../data/siteData'
import './ScheduleModal.css'

const periods = ['Manhã', 'Tarde', 'Noite']

export default function ScheduleModal({ initialTopic, onClose }) {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    topic: initialTopic ?? '',
    period: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [sentMessage, setSentMessage] = useState(null)
  const [copied, setCopied] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const buildMessage = () => {
    const topicName = topics.find((t) => t.id === form.topic)?.name
    return [
      'Olá! Gostaria de agendar uma sessão online.',
      `Nome: ${form.name.trim()}`,
      `Contato: ${form.contact.trim()}`,
      topicName && `Tema: ${topicName}`,
      form.period && `Melhor período: ${form.period}`,
      form.message.trim() && `Mensagem: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Informe seu nome.'
    if (!form.contact.trim()) next.contact = 'Informe um WhatsApp ou e-mail para retorno.'
    setErrors(next)
    if (Object.keys(next).length) return

    const message = buildMessage()
    setSentMessage(message)

    if (site.whatsapp) {
      window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener')
    }
  }

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(sentMessage)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  // Tela de confirmação
  if (sentMessage) {
    return (
      <Modal title="Solicitação pronta" onClose={onClose}>
        <div className="schedule__done">
          {site.whatsapp ? (
            <p>Abrimos o WhatsApp com a sua mensagem. Se a janela não abriu, copie o texto abaixo e envie para a psicóloga.</p>
          ) : (
            <p>Copie a mensagem abaixo e envie para a psicóloga pelo Instagram. Ela responde para combinar dia e horário.</p>
          )}
          <pre className="schedule__preview">{sentMessage}</pre>
          <div className="schedule__actions">
            <button className="btn btn--primary" onClick={copyMessage}>
              {copied ? 'Mensagem copiada' : 'Copiar mensagem'}
            </button>
            <a className="btn btn--ghost" href={site.social.instagram} target="_blank" rel="noopener noreferrer">
              Abrir Instagram
              <span className="visually-hidden"> (abre em nova aba)</span>
            </a>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title="Agendar sessão online" onClose={onClose}>
      <form className="schedule__form" onSubmit={handleSubmit} noValidate>
        <p className="schedule__intro">
          Não precisa contar o que está sentindo agora. Isso fica para a primeira conversa.
        </p>

        <div className="schedule__field">
          <label htmlFor="ag-nome">Seu nome</label>
          <input
            id="ag-nome" type="text" autoComplete="name"
            value={form.name} onChange={update('name')}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? 'ag-nome-erro' : undefined}
          />
          {errors.name && <span id="ag-nome-erro" className="schedule__error">{errors.name}</span>}
        </div>

        <div className="schedule__field">
          <label htmlFor="ag-contato">WhatsApp ou e-mail</label>
          <input
            id="ag-contato" type="text" autoComplete="email"
            value={form.contact} onChange={update('contact')}
            aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'ag-contato-erro' : undefined}
          />
          {errors.contact && <span id="ag-contato-erro" className="schedule__error">{errors.contact}</span>}
        </div>

        <div className="schedule__row">
          <div className="schedule__field">
            <label htmlFor="ag-tema">Tema (opcional)</label>
            <select id="ag-tema" value={form.topic} onChange={update('topic')}>
              <option value="">Prefiro conversar depois</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="schedule__field">
            <label htmlFor="ag-periodo">Melhor período (opcional)</label>
            <select id="ag-periodo" value={form.period} onChange={update('period')}>
              <option value="">Qualquer um</option>
              {periods.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="schedule__field">
          <label htmlFor="ag-msg">Mensagem (opcional)</label>
          <textarea id="ag-msg" rows="3" value={form.message} onChange={update('message')} />
        </div>

        <button type="submit" className="btn btn--primary schedule__submit">
          Enviar solicitação
        </button>
      </form>
    </Modal>
  )
}
