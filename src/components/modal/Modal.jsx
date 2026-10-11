import { useEffect, useId, useRef } from 'react'
import './Modal.css'

// Janela reutilizável e acessível: fecha com Esc ou clique fora, prende o foco e trava a rolagem do fundo.
export default function Modal({ title, onClose, children }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const dialog = dialogRef.current
    dialog.focus()
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = dialog.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <div
      className="modal__overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="modal__head">
          <h2 id={titleId} className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Fechar janela">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}
