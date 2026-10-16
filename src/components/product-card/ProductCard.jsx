import './ProductCard.css'

// Card de material. É o MESMO componente no site e na prévia do painel admin,
// por isso a prévia sempre fica igual ao que a visitante vai ver.
export default function ProductCard({ title, imageUrl, buyUrl, onClick, preview = false }) {
  const content = (
    <>
      {imageUrl ? (
        <img className="product-card__img" src={imageUrl} alt={`Capa: ${title}`} loading="lazy" />
      ) : (
        <div className="product-card__img product-card__img--empty" aria-hidden="true">Capa</div>
      )}
      <h3 className="product-card__name">{title}</h3>
      <span className="btn btn--primary product-card__btn">
        Comprar
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
        {!preview && <span className="visually-hidden"> (abre em nova aba)</span>}
      </span>
    </>
  )

  if (preview) return <div className="product-card">{content}</div>

  return (
    <a className="product-card" href={buyUrl} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      {content}
    </a>
  )
}
