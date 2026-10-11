import { useEffect, useRef, useState } from 'react'
import './Reveal.css'

// Faz o conteúdo aparecer suavemente quando entra na tela ao rolar.
//  - delay:   atraso em ms (para criar sequência entre blocos)
//  - stagger: se true, os FILHOS diretos aparecem um após o outro (ótimo para listas/cards)
//  - as:      tag HTML usada (div, ul, ol, aside...)
export default function Reveal({ as: Tag = 'div', delay = 0, stagger = false, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Navegadores muito antigos: mostra tudo de uma vez
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // anima só na primeira vez
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const classes = [stagger ? 'reveal-group' : 'reveal', visible ? 'is-visible' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag ref={ref} className={classes} style={{ '--delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
