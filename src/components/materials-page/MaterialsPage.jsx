import { useCallback, useEffect, useState } from 'react'
import { site } from '../../data/siteData'
import usePublicProducts from '../../hooks/usePublicProducts'
import { trackProductClick } from '../../services/products'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import ProductCard from '../product-card/ProductCard'
import ScheduleModal from '../schedule-modal/ScheduleModal'
import Reveal from '../reveal/Reveal'
import './MaterialsPage.css'

// Página própria dos produtos (endereço /materiais): lista completa, com botão de compra.
export default function MaterialsPage() {
  const { products, loading, error } = usePublicProducts()
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const closeSchedule = useCallback(() => setScheduleOpen(false), [])

  useEffect(() => {
    document.title = `Materiais indicados | ${site.name}`
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Header onHome={false} onSchedule={() => setScheduleOpen(true)} />

      <main className="materials">
        <div className="container">
          <a className="materials__back" href="/">← Voltar ao site</a>

          <div className="materials__panel">
            <header className="materials__head">
              <h1 className="materials__title">Materiais indicados</h1>
              <p className="materials__lead">
                Conteúdos criados para quem quer aprender e cuidar da mente também fora da sessão.
              </p>
            </header>

            {loading && (
              <ul className="materials__grid" aria-hidden="true">
                {[1, 2, 3].map((n) => <li key={n}><div className="materials__skeleton" /></li>)}
              </ul>
            )}

            {!loading && (error || products.length === 0) && (
              <p className="materials__empty">
                {error ? 'Não foi possível carregar os materiais agora. Tente novamente em instantes.' : 'Em breve, novos materiais por aqui.'}
              </p>
            )}

            {!loading && !error && products.length > 0 && (
              <Reveal as="ul" stagger className="materials__grid">
                {products.map((p) => (
                  <li key={p.id}>
                    <ProductCard title={p.title} imageUrl={p.imageUrl} buyUrl={p.buyUrl} onClick={() => trackProductClick(p.id)} />
                  </li>
                ))}
              </Reveal>
            )}
          </div>
        </div>
      </main>

      <Footer />
      {scheduleOpen && <ScheduleModal onClose={closeSchedule} />}
    </>
  )
}
