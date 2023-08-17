import React, { useState } from "react";
import "./navbar.css";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import TextField from "@mui/material/TextField";

import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };
  return (
    <>
      <nav className="main-nav">
        {/* 1st logo part  */}
        <div className="logo">
          <a href="/">
            <img
              src="https://res.cloudinary.com/dayvp2ek3/image/upload/v1678014905/guitar-logo_rwp7gh.png"
              width={"150px"}
              alt="logo"
            />
          </a>
        </div>

        {/* 2nd menu part  */}
        <div
          className={
            showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"
          }
        >
          <ul>
            <li>
              <div className="search">
                <form onSubmit={searchSubmitHandler}>
                  <input
                    onChange={(e) => setKeyword(e.target.value)}
                    className="searchbar"
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    placeholder="Search"
                  />
                </form>
              </div>
            </li>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>

            <li>
              <NavLink to="/login">Login/Register</NavLink>
            </li>
          </ul>
        </div>

        {/* 3rd social media links */}
        <div className="social-media">
          <div className="hamburger-menu">
            <a href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <GiHamburgerMenu />
            </a>
          </div>
        </div>
      </nav>


    </>
  );
};

export default Navbar;
