import { useEffect, useState } from 'react'
import { site } from '../../data/siteData'
import './Header.css'

const links = [
  { href: '#quem-somos', label: 'Sobre Mim' },
  { href: '#temas', label: 'Temas' },
  { href: '#atendimento', label: 'Atendimento' },
  { href: '#materiais', label: 'Materiais' },
  { href: '#comunidade', label: 'Comunidade' },
]

export default function Header({ onSchedule }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <a href="#inicio" className="header__brand" onClick={closeMenu}>
          {site.name}
        </a>

        <button
          className="header__toggle"
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="visually-hidden">{menuOpen ? 'Fechar menu' : 'Abrir menu'}</span>
          <span className="header__bars" aria-hidden="true" />
        </button>

        <nav
          id="menu-principal"
          className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}
          aria-label="Principal"
        >
          <ul className="header__list">
            {links.map((l) => (
              <li key={l.href}>
                <a className="header__link" href={l.href} onClick={closeMenu}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            className="btn btn--primary header__cta"
            onClick={() => { closeMenu(); onSchedule() }}
          >
            Agendar sessão online
          </button>
        </nav>
      </div>
    </header>
  )
}