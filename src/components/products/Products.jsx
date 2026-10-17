import usePublicProducts from '../../hooks/usePublicProducts'
import ProductCard from '../product-card/ProductCard'
import Reveal from '../reveal/Reveal'
import './Products.css'

const PREVIEW_COUNT = 4

// Vitrine na home: mostra as primeiras capas "esmaecendo" e um botão que leva à página /materiais
export default function Products() {
  const { products, loading, error } = usePublicProducts()
  const preview = products.slice(0, PREVIEW_COUNT)

  return (
    <section id="materiais" className="products">
      <div className="container">
        <div className="products__panel">
          <Reveal as="header" className="products__head">
            <h2 className="products__title">Materiais indicados</h2>
            <p className="products__lead">
              Conteúdos criados para quem quer aprender e cuidar da mente também fora da sessão.
            </p>
          </Reveal>

          {!loading && (error || products.length === 0) ? (
            <p className="products__empty">
              {error ? 'Não foi possível carregar os materiais agora. Tente novamente em instantes.' : 'Em breve, novos materiais por aqui.'}
            </p>
          ) : (
            <div className="products__teaser">
              {loading ? (
                <ul className="products__list" aria-hidden="true">
                  {[1, 2, 3].map((n) => (
                    <li key={n} className="products__item"><div className="products__skeleton" /></li>
                  ))}
                </ul>
              ) : (
                <Reveal as="ul" stagger delay={150} className="products__list">
                  {preview.map((p) => (
                    <li key={p.id} className="products__item">
                      <ProductCard teaser title={p.title} imageUrl={p.imageUrl} />
                    </li>
                  ))}
                </Reveal>
              )}

              <div className="products__fade" aria-hidden="true" />
              <a className="btn btn--primary products__more" href="/materiais">
                Ver todos os materiais
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
