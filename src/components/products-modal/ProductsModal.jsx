import Modal from '../modal/Modal'
import { products } from '../../data/siteData'
import './ProductsModal.css'

export default function ProductsModal({ onClose }) {
  return (
    <Modal title="Materiais indicados" onClose={onClose}>
      <ul className="products__list">
        {products.map((p) => (
          <li key={p.id} className="products__item">
            <div>
              <h3 className="products__title">{p.title}</h3>
              <p className="products__desc">{p.description}</p>
            </div>
            {p.link ? (
              <a className="btn btn--primary products__btn" href={p.link} target="_blank" rel="noopener noreferrer">
                Comprar
                <span className="visually-hidden"> {p.title} (abre em nova aba)</span>
              </a>
            ) : (
              <span className="btn btn--ghost products__btn" aria-disabled="true">Link em breve</span>
            )}
          </li>
        ))}
      </ul>
    </Modal>
  )
}
