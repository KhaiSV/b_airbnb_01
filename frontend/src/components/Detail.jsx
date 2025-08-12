import React from "react";
import { useParams } from "react-router-dom";
import { allCards } from "../services/cards";
import "./Detail.css";

function Detail() {
  const { id } = useParams();
  const card = allCards.find((item) => item.id === id);

  if (!card) return <h2>Không tìm thấy phòng</h2>;

  const mainImage = card.images?.[0] || "";
  const subImages = card.images?.slice(1) || [];

  return (
    <div className="detail">
      <h1 className="detail__title">{card.title}</h1>

      <div className="detail__container">
        {/* LEFT SIDE */}
        <div className="detail__left">
          <div className="detail__images-wrapper">
            <div className="detail__images">
              <img className="detail__image-main" src={mainImage} alt="Ảnh chính" />
              <div className="detail__image-thumbnails">
                {subImages.map((img, index) => (
                  <div className="thumbnail-wrapper" key={index}>
                    <img src={img} alt={`Ảnh phụ ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="detail__info">
            <p className="detail__price">{card.description}</p>
            <p className="detail__label">
              {card.label || "Nơi nghỉ dưỡng tiện nghi cho gia đình và cặp đôi."}
            </p>

            <div className="detail__host">
              <h3>Host: Viễn</h3>
              <p>Superhost - 10 tháng kinh nghiệm đón khách</p>
            </div>

            <ul className="detail__features">
              <li>🛏️ 1 giường đôi</li>
              <li>🛁 Phòng tắm khép kín</li>
              <li>📍 Vị trí trung tâm</li>
              <li>
                💬 Đánh giá:{" "}
                {card.description.includes("★")
                  ? card.description.split("•")[1]?.trim()
                  : "Chưa có đánh giá"}
              </li>
            </ul>

            <button className="detail__book-btn">Đặt ngay</button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="detail__right">
          <div className="booking-box">
            <h3>Thêm ngày để xem giá</h3>
            <div className="booking-box__dates">
              <input type="text" placeholder="Nhận phòng" />
              <input type="text" placeholder="Trả phòng" />
            </div>
            <div className="booking-box__guests">
              <select>
                <option>1 khách</option>
                <option>2 khách</option>
                <option>3 khách</option>
              </select>
            </div>
            <button className="booking-box__button">Kiểm tra tình trạng còn phòng</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
