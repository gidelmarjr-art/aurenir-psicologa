import usePublicProducts from '../../hooks/usePublicProducts'
import { trackProductClick } from '../../services/products'
import ProductCard from '../product-card/ProductCard'
import Reveal from '../reveal/Reveal'
import './Products.css'

export default function Products() {
  const { products, loading, error } = usePublicProducts()

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

          {loading && (
            <ul className="products__list" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <li key={n} className="products__item"><div className="products__skeleton" /></li>
              ))}
            </ul>
          )}

          {!loading && (error || products.length === 0) && (
            <p className="products__empty">
              {error ? 'Não foi possível carregar os materiais agora. Tente novamente em instantes.' : 'Em breve, novos materiais por aqui.'}
            </p>
          )}

          {!loading && !error && products.length > 0 && (
            <Reveal as="ul" stagger delay={150} className="products__list">
              {products.map((p) => (
                <li key={p.id} className="products__item">
                  <ProductCard
                    title={p.title}
                    imageUrl={p.imageUrl}
                    buyUrl={p.buyUrl}
                    onClick={() => trackProductClick(p.id)}
                  />
                </li>
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
