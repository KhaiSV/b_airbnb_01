//// src/data/cards.js
//----

// export const allCards = [
//   // Dalat
//   {
//     id: "dalat-1",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Phòng tại Dalat",
//     description: "₫604.824 cho 2 đêm • ★ 5.0",
//     label: "Được khách yêu thích",
//   },
//   {
//     id: "dalat-2",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Nhà tại Dalat",
//     description: "₫933.652 cho 2 đêm • ★ 4.83",
//   },
//   {
//     id: "dalat-3",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Căn hộ tại Dalat",
//     description: "₫3.195.296 cho 2 đêm • ★ 4.88",
//   },
//   {
//     id: "dalat-4",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Trọ tại Dalat",
//     description: "₫902.382 cho 2 đêm • ★ 4.88",
//   },
//   {
//     id: "dalat-5",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Trọ tại Dalat",
//     description: "₫902.382 cho 2 đêm • ★ 4.88",
//   },
//   {
//     id: "dalat-6",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Trọ tại Dalat",
//     description: "₫902.382 cho 2 đêm • ★ 4.88",
//   },

//   // Hanoi
//   {
//     id: "hanoi-1",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Nơi ở tại Hoàn Kiếm",
//     description: "₫639.059 cho 2 đêm • ★ 4.82",
//     label: "Được khách yêu thích",
//   },
//   {
//     id: "hanoi-2",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Căn hộ tại Ba Đình",
//     description: "₫1.169.200 cho 2 đêm • ★ 4.77",
//   },
//   {
//     id: "hanoi-3",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Căn hộ tại Hoàn Kiếm",
//     description: "₫944.090 cho 2 đêm • ★ 4.92",
//   },
//   {
//     id: "hanoi-4",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Khách sạn tại Ba Đình",
//     description: "₫1.447.450 cho 2 đêm • ★ 4.77",
//   },
//   {
//     id: "hanoi-5",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Khách sạn tại Ba Đình",
//     description: "₫1.447.450 cho 2 đêm • ★ 4.77",
//   },
//   {
//     id: "hanoi-6",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Khách sạn tại Ba Đình",
//     description: "₫1.447.450 cho 2 đêm • ★ 4.77",
//   },

//   // HCM
//   {
//     id: "hcm-1",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Nơi ở tại Quận 1",
//     description: "₫639.059 cho 2 đêm • ★ 4.82",
//     label: "Được khách yêu thích",
//   },
//   {
//     id: "hcm-2",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Căn hộ tại Thủ Đức",
//     description: "₫1.169.200 cho 2 đêm • ★ 4.77",
//   },
//   {
//     id: "hcm-3",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Căn hộ tại Quận 7",
//     description: "₫944.090 cho 2 đêm • ★ 4.92",
//   },
//   {
//     id: "hcm-4",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Khách sạn tại Bình Thạnh",
//     description: "₫1.447.450 cho 2 đêm • ★ 4.77",
//   },
//   {
//     id: "hcm-5",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Khách sạn tại Phú Nhuận",
//     description: "₫1.447.450 cho 2 đêm • ★ 4.77",
//   },
//   {
//     id: "hcm-6",
//     src: "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
//     title: "Khách sạn tại Gò Vấp",
//     description: "₫1.447.450 cho 2 đêm • ★ 4.77",
//   },
// ];


export const allCards = [
  // Dalat
  {
    id: "dalat-1",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"   
    ],
  },
  {
    id: "dalat-2",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
  {
    id: "dalat-3",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
  {
    id: "dalat-4",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"   
    ],
  },
  {
    id: "dalat-5",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
  {
    id: "dalat-6",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },

  // Hanoi
  {
    id: "hanoi-1",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
  {
    id: "hanoi-2",
   title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
  {
    id: "hanoi-3",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
  {
    id: "hanoi-4",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
  {
    id: "hanoi-5",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
  {
    id: "hanoi-6",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },

  // HCM
  {
    id: "hcm-1",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
  {
    id: "hcm-2",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
  {
    id: "hcm-3",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
  {
    id: "hcm-4",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"   
    ],
  },
  {
    id: "hcm-5",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"   
    ],
  },
  {
    id: "hcm-6",
    title: "Phòng tại Dalat, Việt Nam",
    description: "1 giường đôi • Phòng tắm khép kín",
    label: "Được khách yêu thích",
    rating: 5.0,
    reviews: 42,
    price: "₫604.824 cho 2 đêm",
    location: "Dalat, Việt Nam",
    host: {
      name: "Viễn",
      isSuperhost: true,
      experience: "10 tháng kinh nghiệm đón tiếp khách",
      avatar: "..assets/airbnb-logo.png" // nếu có
    },
    amenities: [
      "Tự nhận phòng",
      "Phòng trong nhà",
      "Hủy miễn phí trước 10 tháng 8"
    ],
    images: [
        "https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg",
        "/image/dalat_01/dalat_2.png",
        "/image/dalat_01/dalat_3.png",
        "/image/dalat_01/dalat_4.png"
    ],
  },
];