import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Detail.css";

const API_BASE = "http://localhost:3001";

function Description({ text }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="detail__description">
      <div
        className={`description-text ${expanded ? "expanded" : "collapsed"}`}
        dangerouslySetInnerHTML={{ __html: text }}
      />

      {!expanded && (
        <button className="show-more-btn" onClick={toggleExpanded}>
          Hiển thị thêm
        </button>
      )}

      {expanded && (
        <button className="show-more-btn" onClick={toggleExpanded}>
          Thu gọn
        </button>
      )}
    </div>
  );
}

function Detail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const calcNights = () => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const nights = calcNights();
  const total = nights * data?.HS_CurrentPrice;

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }
    if (nights <= 0) {
      alert("Ngày trả phòng phải sau ngày nhận phòng!");
      return;
    }
    alert(
      `Đặt phòng thành công!\nNgày nhận: ${checkIn}\nNgày trả: ${checkOut}\nKhách: ${guests}\nSố đêm: ${nights}\nTổng: ${total.toLocaleString()}đ`
    );
  };
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`${API_BASE}/homestays/${id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setSaved(localStorage.getItem(`saved:${id}`) === "1");
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSave = () => {
    const key = `saved:${id}`;
    setSaved((prev) => {
      const next = !prev;
      localStorage.setItem(key, next ? "1" : "0");
      return next;
    });
  };

  if (loading) return <h2>Đang tải...</h2>;
  if (!data) return <h2>Không tìm thấy homestay</h2>;

  const images = data.HS_ListOfImage
    ? data.HS_ListOfImage.split("|").map((s) => s.trim())
    : [];
  const mainImage = images[0] || "";
  const subImages = images.slice(1, 5); // lấy 4 ảnh


  return (
    <div className="detail">
      {/* Header */}
      <div className="detail__header">
        <h1>{data.HS_LongName}</h1>
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

      {/* Gallery */}
      <div className="detail__gallery">
        <div className="gallery__main">
          {images[0] && <img src={images[0]} alt="Ảnh chính" />}
        </div>
        <div className="gallery__side">
          {images.slice(1, 5).map((img, i) => (
            <img key={i} src={img} alt={`Ảnh phụ ${i + 1}`} />
          ))}
        </div>
      </div>


      <div className="detail__container">
        {/* Left side */}
        <div className="detail__content">
          {/* Info */}
          <div className="detail__info-top">
            <h2>
              Toàn bộ {data.HS_ShortName} cho thuê tại {data.HS_Address}
            </h2>
            <p>
              {data.HS_Room ||
                "3 khách • 1 phòng ngủ • 1 giường • 1 phòng tắm"}
            </p>
          </div>

          <div className="favorite-box">
            <div className="favorite-left">
              <span className="laurel">🍃</span>
              <span className="favorite-text">Được khách yêu thích</span>
              <span className="laurel">🍃</span>
            </div>

            <div className="favorite-middle">
              Khách đánh giá đây là một trong những ngôi nhà được yêu thích nhất trên Airbnb
            </div>

            <div className="favorite-right">
              <div className="rating">
                <span className="rating-score">{data.HS_AvgRating.toFixed(2)}</span>
                <span className="stars">★★★★★</span>
              </div>
              <div className="reviews">
                <span className="review-num">{data.HS_NumOfReview}</span>
                <span className="review-text">đánh giá</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <Description text={data.HS_Description} />
        </div>

        {/* Right side: Booking box */}
        <div className="detail__right">
          <div className="booking-box">
            <h3>
              {data?.HS_CurrentPrice.toLocaleString()}đ{" "}
              <span className="per-night">/ đêm</span>
            </h3>

            {/* Chọn ngày */}
            <div className="booking-box__dates">
              <div className="date-input">
                <label>Nhận phòng</label> 
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="date-input">
                <label>Trả phòng</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            {/* Chọn khách */}
            <div className="booking-box__guests">
              <label>Khách</label>
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                <option value={1}>1 khách</option>
                <option value={2}>2 khách</option>
                <option value={3}>3 khách</option>
                <option value={4}>4 khách</option>
              </select>
            </div>

            {/* Tính toán số đêm & tổng tiền */}
            {nights > 0 && (
              <p className="booking-summary">
                {nights} đêm • {total.toLocaleString()}đ
              </p>
            )}

            <button className="booking-box__button" onClick={handleBooking}>
              Đặt phòng
            </button>

            <p className="note">Bạn vẫn chưa bị trừ tiền</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
