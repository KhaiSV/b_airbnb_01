import React from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import ExpandMoreIcon from "@mui/icons-material/Menu";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import airbnbLogo from "./assets/airbnb-logo.png";

function Header() {
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
            <input type="text" placeholder="Search Destinations" />
          </div>
          <div className="header__searchField">
            <label>Check in</label>
            <input type="text" placeholder="Add dates" />
          </div>
          <div className="header__searchField">
            <label>Check out</label>
            <input type="text" placeholder="Add dates" />
          </div>
          <div className="header__searchField">
            <label>Who</label>
            <input type="text" placeholder="Add guest" />
          </div>
          <button className="header__searchButton">
            <SearchIcon />
          </button>
        </div>
      </div>

      {/* Right section */}
      <div className="header__right">
        <p>Become a host</p>
        <LanguageIcon />
        <div className="header__menuAvatar">
          <ExpandMoreIcon />
          <Avatar />
        </div>
      </div>
    </div>
  );
}

export default Header;
