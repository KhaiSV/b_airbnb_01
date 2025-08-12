import React from "react";
import "./Section.css";
import Card from "../Card";

function Section({ title, cards }) {
  return (
    <div className="section">
      <h2 className="section__title">{title}</h2>
      <div className="section__cards">
        {cards?.map((item, index) => (
          <Card
            key={item.id}
            id={item.id} // 👉 THÊM DÒNG NÀY
            src={item.src}
            title={item.title}
            description={item.description}
            price={item.price}
            label={item.label} // 👈 THÊM label nếu bạn có
          />
        ))}
      </div>
    </div>
  );
}

export default Section;
