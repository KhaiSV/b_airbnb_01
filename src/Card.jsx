import React from "react";
import "./Card.css";

function Card({ src, title, description, price, label }) {
  return (
    <div className="card">
      {label && <div className="card__label">{label}</div>}
      <img src={src} alt={title} className="card__image" />
      <div className="card__info">
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{description}</p>
        {price && <p className="card__price">{price}</p>}
      </div>
    </div>
  );
}

export default Card;
