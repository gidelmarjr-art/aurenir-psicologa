import { products } from '../../data/siteData'
import './Products.css'

export default function Products() {
  return (
    <section id="materiais" className="products">
      <div className="container">
        <div className="products__panel">
          <header className="products__head">
            <h2 className="products__title">Materiais indicados</h2>
            <p className="products__lead">
              Conteúdos criados para quem quer aprender e cuidar da mente também fora da sessão.
            </p>
          </header>

          <ul className="products__list">
            {products.map((p) => (
              <li key={p.id} className="products__item">
                <a
                  className="products__card"
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className="products__img" src={p.image} alt={`Capa: ${p.title}`} loading="lazy" />
                  <h3 className="products__name">{p.title}</h3>
                  <span className="btn btn--primary products__btn">
                    Comprar
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                    <span className="visually-hidden"> (abre em nova aba)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
