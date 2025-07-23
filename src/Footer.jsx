import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>ABOUT</h3>
          <p>Company information, mission, etc.</p>
        </div>
        <div className="footer-section support">
          <h3>SUPPORT</h3>
          <ul>
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div className="footer-section social-media">
          <h3>SOCIAL MEDIA</h3>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </div>
        <div className="footer-section subscribe">
          <h3>SUBSCRIBE</h3>
          <div>
            <label htmlFor="email">Subscribe to Our Newsletter</label>
            <input type="email" id="email" placeholder="Email *" required />
            <button type="submit">Submit</button>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>
          <FontAwesomeIcon icon={faCopyright} /> 2025 - Group 01 - AirBnB Clone{" "}
          <a href="#">Find Out More</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
