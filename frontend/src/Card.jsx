import { Link } from "react-router-dom";

function Card({ id, src, title, description, price, label }) {
  return (
    <Link to={`/details/${id}`} className="card__link">
      <div className="card">
        {label && <div className="card__label">{label}</div>}
        <img src={src} alt={title} className="card__image" />
        <div className="card__info">
          <h3 className="card__title">{title}</h3>
          <p className="card__description">{description}</p>
          {price && <p className="card__price">{price}</p>}
        </div>
      </div>
    </Link>
  );
}

export default Card;
