import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { allCards } from "../services/cards";
import "./Detail.css";

const API_BASE = "http://localhost:3001";

function Detail() {
  const { id } = useParams();

  // dữ liệu mock sẵn có
  const card = allCards.find((item) => String(item.id) === String(id));
  const [saved, setSaved] = useState(false);

  // đồng bộ trạng thái "Lưu" theo id
  useEffect(() => {
    if (!id) return;
    const key = `saved:${id}`;
    setSaved(localStorage.getItem(key) === "1");
  }, [id]);

  const toggleSave = () => {
    const key = `saved:${id}`;
    setSaved((prev) => {
      const next = !prev;
      localStorage.setItem(key, next ? "1" : "0");
      return next;
    });
  };

  if (!card) return <h2>Không tìm thấy phòng</h2>;

  const mainImage = card.images?.[0] || "";
  const subImages = card.images?.slice(1) || [];

  return (
    <div className="detail">
      {/* Header: tiêu đề bên trái, nút Lưu bên phải */}
      <div className="detail__header">
        <h1 className="detail__title">{card.title}</h1>

        <button
          type="button"
          className={`save-btn ${saved ? "is-saved" : ""}`}
          onClick={toggleSave}
          aria-pressed={saved}
          aria-label={saved ? "Bỏ lưu" : "Lưu"}
          title={saved ? "Bỏ lưu" : "Lưu"}
        >
          {/* icon trái tim */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="save-btn__icon"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21c-4.8-3.6-8-6.4-8-10.4C4 7.2 6.5 5 9.5 5c1.6 0 3.2.8 4.1 2.1C14.3 5.8 15.9 5 17.5 5 20.5 5 23 7.2 23 10.6c0 4-3.2 6.8-8 10.4z"
            />
          </svg>

          <span className="save-btn__text">{saved ? "Đã lưu" : "Lưu"}</span>
        </button>
      </div>

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
