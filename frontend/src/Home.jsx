import React from "react";
import "./Home.css";
import Section from "./components/Section";
import Footer from "./Footer";
import Card from "./Card";

function Home() {
  const dalatCards = [
    {
      id: "dalat-1",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Phòng tại Dalat",
      description: "₫604.824 cho 2 đêm • ★ 5.0",
      label: "Được khách yêu thích",
    },
    {
      id: "dalat-2",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Nhà tại Dalat",
      description: "₫933.652 cho 2 đêm • ★ 4.83",
    },
    {
      id: "dalat-3",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Căn hộ tại Dalat",
      description: "₫3.195.296 cho 2 đêm • ★ 4.88",
    },
    {
      id: "dalat-4",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Trọ tại Dalat",
      description: "₫902.382 cho 2 đêm • ★ 4.88",
    },
    {
      id: "dalat-5",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Trọ tại Dalat",
      description: "₫902.382 cho 2 đêm • ★ 4.88",
    },
    {
      id: "dalat-6",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Trọ tại Dalat",
      description: "₫902.382 cho 2 đêm • ★ 4.88",
    },
  ];

  const hanoiCards = [
    {
      id: "hanoi-1",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Nơi ở tại Hoàn Kiếm",
      description: "₫639.059 cho 2 đêm • ★ 4.82",
      label: "Được khách yêu thích",
    },
    {
      id: "hanoi-2",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Căn hộ tại Ba Đình",
      description: "₫1.169.200 cho 2 đêm • ★ 4.77",
    },
    {
      id: "hanoi-3",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Căn hộ tại Hoàn Kiếm",
      description: "₫944.090 cho 2 đêm • ★ 4.92",
    },
    {
      id: "hanoi-4",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Khách sạn tại Ba Đình",
      description: "₫1.447.450 cho 2 đêm • ★ 4.77",
    },
    {
      id: "hanoi-5",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Khách sạn tại Ba Đình",
      description: "₫1.447.450 cho 2 đêm • ★ 4.77",
    },
    {
      id: "hanoi-6",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Khách sạn tại Ba Đình",
      description: "₫1.447.450 cho 2 đêm • ★ 4.77",
    },
  ];

  const hcmCards = [
    {
      id: "hcm-1",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Nơi ở tại Hoàn Kiếm",
      description: "₫639.059 cho 2 đêm • ★ 4.82",
      label: "Được khách yêu thích",
    },
    {
      id: "hcm-2",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Căn hộ tại Ba Đình",
      description: "₫1.169.200 cho 2 đêm • ★ 4.77",
    },
    {
      id: "hcm-3",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Căn hộ tại Hoàn Kiếm",
      description: "₫944.090 cho 2 đêm • ★ 4.92",
    },
    {
      id: "hcm-4",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Khách sạn tại Ba Đình",
      description: "₫1.447.450 cho 2 đêm • ★ 4.77",
    },
    {
      id: "hcm-5",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Khách sạn tại Ba Đình",
      description: "₫1.447.450 cho 2 đêm • ★ 4.77",
    },
    {
      id: "hcm-6",
      src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
      title: "Khách sạn tại Ba Đình",
      description: "₫1.447.450 cho 2 đêm • ★ 4.77",
    },
  ];

  return (
    <div className="home">
      <Section
        title="Nơi lưu trú được ưa chuộng tại Đà Lạt"
        cards={dalatCards}
      />
      <Section title="Còn phòng tại Hà Nội vào tháng tới" cards={hanoiCards} />
      <Section title="Nơi lưu trú hấp dẫn ở TP. Hồ Chí Minh" cards={hcmCards} />
    </div>
  );
}

export default Home;
