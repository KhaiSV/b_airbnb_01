import React, { useState, useEffect } from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import ExpandMoreIcon from "@mui/icons-material/Menu";
import { Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import airbnbLogo from "./assets/airbnb-logo.png";

function Header() {
  const navigate = useNavigate();
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Search functionality states
  const [dateState, setDateState] = useState({
    checkIn: {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      selectedDay: null,
      isOpen: false,
      manualDay: "",
      manualMonth: "",
      manualYear: "",
    },
    checkOut: {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      selectedDay: null,
      isOpen: false,
      manualDay: "",
      manualMonth: "",
      manualYear: "",
    },
  });
  const [searchInputs, setSearchInputs] = useState({
    where: "",
  });
  const [guestMenuOpen, setGuestMenuOpen] = useState(false);
  const [guestCounts, setGuestCounts] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const [hasServiceAnimal, setHasServiceAnimal] = useState(false);

  // Authentication useEffect
  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Đóng dropdown khi click bên ngoài
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header__userMenu')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Authentication handlers
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setUserDropdownOpen(false);
    window.location.reload();
  };

  // Search handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuestChange = (type, delta) => {
    setGuestCounts((prev) => {
      const newValue = Math.max(0, prev[type] + delta);
      return { ...prev, [type]: newValue };
    });
  };

  const handleGuestInput = (type, value) => {
    const newValue = Math.max(0, parseInt(value) || 0);
    setGuestCounts((prev) => ({ ...prev, [type]: newValue }));
  };

  const handleSearch = () => {
    const { where } = searchInputs;
    const checkInDate = dateState.checkIn.selectedDay
      ? `${dateState.checkIn.selectedDay}/${dateState.checkIn.month + 1}/${
          dateState.checkIn.year
        }`
      : dateState.checkIn.manualDay &&
        dateState.checkIn.manualMonth &&
        dateState.checkIn.manualYear
      ? `${dateState.checkIn.manualDay}/${dateState.checkIn.manualMonth}/${dateState.checkIn.manualYear}`
      : "";
    const checkOutDate = dateState.checkOut.selectedDay
      ? `${dateState.checkOut.selectedDay}/${dateState.checkOut.month + 1}/${
          dateState.checkOut.year
        }`
      : dateState.checkOut.manualDay &&
        dateState.checkOut.manualMonth &&
        dateState.checkOut.manualYear
      ? `${dateState.checkOut.manualDay}/${dateState.checkOut.manualMonth}/${dateState.checkOut.manualYear}`
      : "";
    const totalGuests = calculateTotalGuests();

    if (where && checkInDate && checkOutDate && totalGuests > 0) {
      navigate("/search", {
        state: {
          where,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          who: totalGuests.toString(),
          hasServiceAnimal,
        },
      });
    } else {
      alert(
        "Please fill in all fields and select at least one guest with valid dates before searching!"
      );
    }
  };

  const calculateTotalGuests = () => {
    return (
      guestCounts.adults +
      guestCounts.children +
      guestCounts.infants +
      guestCounts.pets
    );
  };

  const toggleDatePicker = (field) => {
    setDateState((prev) => ({
      ...prev,
      [field]: { ...prev[field], isOpen: !prev[field].isOpen },
    }));
  };

  const selectDate = (field, day) => {
    setDateState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        selectedDay: day,
        isOpen: false,
      },
    }));
  };

  const handleManualDateChange = (field, type, value) => {
    setDateState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: value,
      },
    }));
  };

  const confirmManualDate = (field) => {
    const day = parseInt(dateState[field].manualDay) || 1;
    const month = parseInt(dateState[field].manualMonth) - 1 || 0;
    const year =
      parseInt(dateState[field].manualYear) || new Date().getFullYear();
    const maxDay = new Date(year, month + 1, 0).getDate();
    const validDay = Math.min(Math.max(1, day), maxDay);

    setDateState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        selectedDay: validDay,
        month,
        year,
        isOpen: false,
        manualDay: validDay.toString(),
        manualMonth: (month + 1).toString(),
        manualYear: year.toString(),
      },
    }));
  };

  return (
    <div className="header">
      {/* Logo */}
      <Link to="/" className="header__logo">
        <img src={airbnbLogo} alt="Airbnb" />
      </Link>

      {/* Search bar */}
      <div className="header__center">
        <div className="header__searchContainer">
          <div className="header__searchField">
            <label>Where</label>
            <input
              type="text"
              name="where"
              placeholder="Search Destinations"
              value={searchInputs.where}
              onChange={handleInputChange}
            />
          </div>
          {["checkIn", "checkOut"].map((field) => (
            <div key={field} className="header__searchField date-field">
              <label>{field === "checkIn" ? "Check in" : "Check out"}</label>
              <div
                className="header__dateInput"
                onClick={() => toggleDatePicker(field)}
              >
                {dateState[field].selectedDay
                  ? `${dateState[field].selectedDay}/${
                      dateState[field].month + 1
                    }/${dateState[field].year}`
                  : "Add dates"}
              </div>
              {dateState[field].isOpen && (
                <div
                  className="header__datePicker"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="header__dateHeader">
                    <button
                      onClick={() =>
                        setDateState((prev) => ({
                          ...prev,
                          [field]: {
                            ...prev[field],
                            month: prev[field].month - 1,
                          },
                        }))
                      }
                    >
                      {"<"}
                    </button>
                    <span>
                      {new Date(
                        dateState[field].year,
                        dateState[field].month
                      ).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() =>
                        setDateState((prev) => ({
                          ...prev,
                          [field]: {
                            ...prev[field],
                            month: prev[field].month + 1,
                          },
                        }))
                      }
                    >
                      {">"}
                    </button>
                  </div>
                  <div className="header__dateCalendar">
                    {Array.from(
                      {
                        length: new Date(
                          dateState[field].year,
                          dateState[field].month + 1,
                          0
                        ).getDate(),
                      },
                      (_, i) => i + 1
                    ).map((day) => (
                      <button
                        key={day}
                        className={`header__dateDay ${
                          dateState[field].selectedDay === day ? "selected" : ""
                        }`}
                        onClick={() => selectDate(field, day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <div className="header__manualDate">
                    <span>Nhập ngày cụ thể</span>
                    <div className="header__manualDateInputs">
                      <input
                        type="number"
                        value={dateState[field].manualDay}
                        onChange={(e) =>
                          handleManualDateChange(
                            field,
                            "manualDay",
                            e.target.value
                          )
                        }
                        placeholder="DD"
                        min="1"
                        max="31"
                      />
                      <span>/</span>
                      <input
                        type="number"
                        value={dateState[field].manualMonth}
                        onChange={(e) =>
                          handleManualDateChange(
                            field,
                            "manualMonth",
                            e.target.value
                          )
                        }
                        placeholder="MM"
                        min="1"
                        max="12"
                      />
                      <span>/</span>
                      <input
                        type="number"
                        value={dateState[field].manualYear}
                        onChange={(e) =>
                          handleManualDateChange(
                            field,
                            "manualYear",
                            e.target.value
                          )
                        }
                        placeholder="YYYY"
                        min="2000"
                        max="2100"
                      />
                    </div>
                    <button
                      className="header__confirmButton"
                      onClick={() => confirmManualDate(field)}
                    >
                      CHỌN
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="header__searchField guest-field">
            <label>Who</label>
            <div
              className="header__guestInput"
              onClick={() => setGuestMenuOpen(!guestMenuOpen)}
            >
              {calculateTotalGuests()} guests
            </div>
            {guestMenuOpen && (
              <div className="header__guestMenu">
                {Object.keys(guestCounts).map((type) => (
                  <div
                    key={type}
                    className="header__guestOption"
                    data-age={
                      type === "adults"
                        ? "Age 13 or above"
                        : type === "children"
                        ? "Ages 2-12"
                        : "Under 2"
                    }
                  >
                    <label>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                    <div className="header__guestControls">
                      <button
                        onClick={() => handleGuestChange(type, -1)}
                        disabled={guestCounts[type] === 0}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={guestCounts[type]}
                        onChange={(e) => handleGuestInput(type, e.target.value)}
                        min="0"
                      />
                      <button onClick={() => handleGuestChange(type, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className="header__guestOption">
                  <label>Service Animal</label>
                  <input
                    type="checkbox"
                    checked={hasServiceAnimal}
                    onChange={(e) => setHasServiceAnimal(e.target.checked)}
                  />
                </div>
              </div>
            )}
          </div>
          <button className="header__searchButton" onClick={handleSearch}>
            <SearchIcon />
          </button>
        </div>
      </div>

      {/* Right section */}
      <div className="header__right">
        <p>Become a host</p>
        <LanguageIcon />
        
        {user ? (
          <div className="header__userMenu">
            <span className="header__username">Xin chào, {user.firstName || user.username}!</span>
            <div 
              className="header__menuAvatar" 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <ExpandMoreIcon />
              <Avatar />
            </div>
            {userDropdownOpen && (
              <div className="header__userDropdown">
                <Link to="/profile" className="header__dropdownItem" onClick={() => setUserDropdownOpen(false)}>
                  <span>Thông tin cá nhân</span>
                </Link>
                <Link to="/change-password" className="header__dropdownItem" onClick={() => setUserDropdownOpen(false)}>
                  <span>Đổi mật khẩu</span>
                </Link>
                <div className="header__dropdownItem" onClick={handleLogout}>
                  <span>Đăng xuất</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="header__authButtons">
            <Link to="/login" className="header__loginBtn">Đăng nhập</Link>
            <Link to="/register" className="header__registerBtn">Đăng ký</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
